import { getRoot, types } from "mobx-state-tree";
import Shader from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";

const webcam = types
  .model("Image", {
    type: "ImageInput",
    name: "Image",
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    frag: `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform vec2 img_dimensions;
            uniform bool bSquare;
            uniform sampler2D tex0;
            void main() {                
                vec3 color = vec3(0.0);
                float aspect = img_dimensions.x / img_dimensions.y;
                vec2 uv = vTexCoord;
                // if (bSquare) {
                    uv.y *= aspect;
                // }
                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`
  })
  .volatile(self => ({
    img: null
  }))
  .actions(self => {
    let root_store;

    function afterAttach() {
      console.log('attached image input')
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

      // prevents init() from being called twice
      self.ready = true;

      // removes 'tex0' from inputs, since it's provided
      // by the webcam stream.
      self.inputs = [];
    }
    
    function loadImage(img) {
      console.log('loading image', img);
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
      loadImage
    };
  });

const Webcam = types.compose(
  Shader,
  webcam
);
export default Webcam;
