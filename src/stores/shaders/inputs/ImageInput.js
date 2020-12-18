import { getRoot, types } from "mobx-state-tree";
import Shader from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";

const webcam = types
  .model("Image", {
    type: "ImageInput",
    name: "Image",
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    // img: types.frozen(),
    display_mode: types.optional(
      types.enumeration("Display Mode", ["preserve_aspect", "stretch"]),
      "preserve_aspect"
    ),
    attachment: types.optional(
      types.enumeration("Attachment", [
        "TOP_LEFT",
        "TOP_CENTER",
        "TOP_RIGHT",
        "CENTER_LEFT",
        "CENTER_CENTER",
        "CENTER_RIGHT",
        "BOTTOM_LEFT",
        "BOTTOM_CENTER",
        "BOTTOM_RIGHT"
      ]),
      "CENTER_CENTER"
    ),
    frag: `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform vec2 img_dimensions;
            uniform int display_mode;
            uniform vec2 attachment;
            uniform sampler2D tex0;

            void main() {                
                vec3 color = vec3(0.0);
                vec2 uv = vTexCoord;

                float imgAspect = img_dimensions.x > img_dimensions.y ? 
                    img_dimensions.x / img_dimensions.y : 
                    img_dimensions.y / img_dimensions.x;
                    
                float windowAspect = resolution.y / resolution.x;

                if (display_mode == 0) { // preserve aspect
                    uv.y *= windowAspect * imgAspect;
                    uv.y -= (windowAspect * imgAspect) / 2.0;
                    uv.y += 0.5;
                }
                
                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`
  })
  .volatile(self => ({
    img: null
  }))
  .views(self => ({
    get displayModeId() {
      return ["preserve_aspect", "stretch"].indexOf(self.display_mode);
    }
  }))
  .actions(self => {
    let root_store;

    function afterAttach() {
      console.log("attached image input");
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

      self.img = p.loadImage("images/muybridge.jpg");
      console.log(self.img)

      // prevents init() from being called twice
      self.ready = true;

      // removes 'tex0' from inputs, since it's provided
      // by the webcam stream.
      self.inputs = [];
    }

    function loadImage(e) {
      let file = e.target.files[0];
      if (!file.type.startsWith("image/")) return;

      var reader = new FileReader();

      reader.onload = e => {
        var image = document.createElement("img");
        let p = root_store.p5_instance;
        self.setImage(p.loadImage(e.target.result));
      };

      reader.readAsDataURL(file);
    }

    function setImage(img) {
      self.img = img;
    }

    function setDisplayMode(mode) {
      self.display_mode = mode;
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

      shader.setUniform("tex0", self.img);
      shader.setUniform("resolution", [target.width, target.height]);
      shader.setUniform("img_dimensions", [self.img.width, self.img.height]);
      shader.setUniform("display_mode", self.displayModeId);

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
      setDisplayMode,
      loadImage,
      setImage
    };
  });

const Webcam = types.compose(
  Shader,
  webcam
);
export default Webcam;
