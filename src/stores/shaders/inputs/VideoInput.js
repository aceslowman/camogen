import { getRoot, types, flow } from "mobx-state-tree";
import Shader, { Uniform } from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";
import { nanoid } from "nanoid";
import Parameter from "../../ParameterStore";

const video = types
  .model("Video", {
    type: "VideoInput",
    name: "Video",
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    user_filename: "",
    dataURL: "",
    display_mode: types.optional(
      types.enumeration("Display Mode", [
        "fit_vertical",
        "fit_horizontal",
        "stretch"
      ]),
      "fit_vertical"
    ),
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
                    float imgAspect = img_dimensions.y / img_dimensions.x;                    
                    float windowAspect = resolution.x / resolution.y;
                
                    uv.x *= windowAspect * imgAspect;
                    uv.x -= (windowAspect * imgAspect) / 2.0;
                    uv.x += 0.5;
                } else if(display_mode == 1) { // fit horizontal
                    float imgAspect = img_dimensions.x / img_dimensions.y;                    
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
    video: null,
    video_url: null
  }))
  .views(self => ({
    get displayModeId() {
      return ["fit_vertical", "fit_horizontal", "stretch"].indexOf(
        self.display_mode
      );
    }
  }))
  .actions(self => {
    let root_store;

    return {
      afterAttach: () => {
        // console.log("attached image input", getSnapshot(self));
        root_store = getRoot(self);
        if(self.user_filename) {
          console.log('flag RootStore!', getRoot(self))
          let rootStore = getRoot(self).flagAssetsAsMissing(self);
        }
      },

      beforeDestroy: () => {
        // revoke previous url!
        if (self.dataURL) URL.revokeObjectURL(self.dataURL);
      },

      init: () => {
        self.ref = self.target.ref.createShader(self.vertex, self.fragment);

        self.extractUniforms();

        for (let uniform of self.uniforms) {
          self.ref.setUniform(uniform.name, uniform.elements);

          for (let param of uniform.elements) {
            if (param.graph) self.parameter_graphs.push(param.graph);
          }
        }

        // set default video
        self.setAsset("videos/duck_demo.mp4");

        // prevents init() from being called twice
        self.ready = true;

        /* 
          removes 'tex0' from inputs, since it's provided
          by the video stream.
        */
        self.inputs = [];
      },

      loadVideo: file => {
        // revoke previous url!
        if (self.dataURL) URL.revokeObjectURL(self.dataURL);

        if (!file.type.startsWith("video/")) return;

        var reader = new FileReader();

        reader.onload = e => {
          var video = document.createElement("video");
          self.setAsset(e.target.result);
          self.setUserFilename(file.name);
        };

        reader.readAsDataURL(file);
        // dataURL helps retrieve the image for other places in the ui
        self.dataURL = URL.createObjectURL(file);
        console.log("URL.createObjectURL()", URL.createObjectURL(file));
      },

      setAsset: video => {
        let p = root_store.p5_instance;
        self.video = p.createVideo(video, () => {
          self.video.loop();
          self.video.hide();
          self.video.volume(0);
        });
        self.video_url = video;
      },
      
      setUserFilename: filename => {
        self.user_filename = filename;
      },

      setDisplayMode: mode => {
        self.display_mode = mode;
      },

      update: p => {
        let shader = self.ref;
        let target = self.target.ref;

        for (let uniform_data of self.uniforms) {
          if (uniform_data.elements.length > 1) {
            let elements = uniform_data.elements.map(e => e.value);
            shader.setUniform(uniform_data.name, elements);
          } else {
            shader.setUniform(
              uniform_data.name,
              uniform_data.elements[0].value
            );
          }
        }

        shader.setUniform("tex0", self.video);
        shader.setUniform("resolution", [target.width, target.height]);
        shader.setUniform("img_dimensions", [
          self.video.width,
          self.video.height
        ]);
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
    };
  });

const Video = types.compose(
  Shader,
  video
).named("VideoInput");
export default Video;
