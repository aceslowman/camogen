import { getRoot, types } from "mobx-state-tree";
import Shader from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";

/*
    TODO: inputs can't be changed, haven't had a second webcam to test with
    TODO: should work in 'attachment' settings
*/

const webcam = types
  .model("Webcam", {
    type: "WebcamInput",
    name: "Webcam",
    input_options: types.array(types.frozen()),
    display_mode: types.optional(
      types.enumeration("Display Mode", [
        "fit_vertical",
        "fit_horizontal",
        "stretch"
      ]),
      "fit_vertical"
    ),
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    frag: `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform vec2 img_dimensions;
            uniform int display_mode;
            uniform vec2 pan; // {'default':[0.0,0.0]}
            uniform sampler2D tex0;

            void main() {                
                vec3 color = vec3(0.0);
                vec2 uv = vTexCoord;

                if (display_mode == 0) { // fit vertical
                    float imgAspect = img_dimensions.x < img_dimensions.y ? 
                      img_dimensions.x / img_dimensions.y : 
                      img_dimensions.y / img_dimensions.x;
                    
                    float windowAspect = resolution.x / resolution.y;
                
                    uv.x *= windowAspect * imgAspect;
                    uv.x -= (windowAspect * imgAspect) / 2.0;
                    uv.x += 0.5;
                } else if(display_mode == 1) { // fit horizontal
                    float imgAspect = img_dimensions.x > img_dimensions.y ? 
                      img_dimensions.x / img_dimensions.y : 
                      img_dimensions.y / img_dimensions.x;
                    
                    float windowAspect = resolution.y / resolution.x;
                
                    uv.y *= windowAspect * imgAspect;
                    uv.y -= (windowAspect * imgAspect) / 2.0;
                    uv.y += 0.5;
                }
                
                uv += pan;
                                
                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`
  })
  .volatile(self => ({
    grabber: null
  }))
  .views(self => ({
    get displayModeId() {
      return ["fit_vertical", "fit_horizontal", "stretch"].indexOf(
        self.display_mode
      );
    },

    get attachmentId() {
      let params = self.attachment.split("_").reverse();
      // swapped to read as x,y
      params[0] = ["LEFT", "CENTER", "RIGHT"].indexOf(params[0]);
      params[1] = ["TOP", "CENTER", "BOTTOM"].indexOf(params[1]);

      return params;
    }
  }))
  .actions(self => {
    let root_store;

    function afterAttach() {
      root_store = getRoot(self);
    }

    function init() {
      self.ref = self.target.ref.createShader(self.vertex, self.fragment);

      self.extractUniforms();

      for (let uniform of self.uniforms) {
        self.ref.setUniform(uniform.name, uniform.elements);

        for (let param of uniform.elements) {
          if (param.graph) self.parameter_graphs.push(param.graph);
        }
      }

      let p = root_store.p5_instance;

      let constraints = {
        video: {
          // mandatory: {
          //   minWidth: 1920,
          //   minHeight: 1080
          // }
          // optional: [{
          // maxFrameRate: 10
          // }]
        },
        deviceId: 0,
        audio: false
      };

      self.grabber = p.createCapture(constraints, () => {
        console.log("grabber activated");
        self.grabber.hide();
      });

      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
      }

      // List cameras
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          let videoinputs = devices.filter(e => e.kind === "videoinput");
          self.setInputOptions(videoinputs);
          videoinputs.forEach(function(device) {
            console.log(
              device.kind + ": " + device.label + " id = " + device.deviceId
            );
          });
        })
        .catch(err => {
          console.log(err.name + ": " + err.message);
        });

      // allows user to capture screen, may be useful elsewhere!
      // navigator.mediaDevices.getDisplayMedia()

      // prevents init() from being called twice
      self.ready = true;

      // removes 'tex0' from inputs, since it's provided
      // by the webcam stream.
      self.inputs = [];
    }

    function setInputOptions(opt) {
      self.input_options = opt;
    }

    function setDisplayMode(mode) {
      self.display_mode = mode;
    }

    function setInput(input) {
      console.log("input", input);
    }

    function update(p) {
      let shader = self.ref;
      let target = self.target.ref;

      for (let uniform_data of self.uniforms) {
        if (uniform_data.elements.length > 1) {
          let elements = uniform_data.elements.map(e => e.value);
          shader.setUniform(uniform_data.name, elements);
        } else {
          shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
        }
      }

      shader.setUniform("tex0", self.grabber);
      shader.setUniform("resolution", [target.width, target.height]);
      shader.setUniform("img_dimensions", [
        self.grabber.width,
        self.grabber.height
      ]);
      shader.setUniform("display_mode", self.displayModeId);
      // shader.setUniform('attachment', self.attachmentId);

      target.shader(shader);

      try {
        target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
      } catch (error) {
        console.error(error);
        console.log("frag", shader);
        p.noLoop();
      }
    }

    return {
      afterAttach,
      init,
      update,
      setInputOptions,
      setDisplayMode,
      setInput
    };
  });

const Webcam = types.compose(
  Shader,
  webcam
);
export default Webcam;
