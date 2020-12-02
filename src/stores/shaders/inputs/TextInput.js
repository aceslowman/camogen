import { getRoot, types } from "mobx-state-tree";
import Shader from "../../ShaderStore";
import * as DefaultShader from "../DefaultShader";

const text = types
  .model("Text", {
    type: "TextInput",
    name: "Text", //TODO get rid of this, only need type
    content: "Hell World",
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    frag: `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform sampler2D tex0;

            void main() {                
                vec3 color = vec3(0.0);
                vec2 uv = vTexCoord;

                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`
  })
  .volatile(self => ({
    canvas: null,
    ctx: null,
    texture: null
  }))
  .actions(self => {
    let root_store;

    function afterAttach() {
      root_store = getRoot(self);
    }

    function init() {
      
      let p = root_store.p5_instance;
      
      self.canvas = document.createElement("canvas");

      self.canvas.id = "TextLayer";
      self.canvas.width = 512;
      self.canvas.height = 512;
      self.canvas.style.color = "black";
      self.canvas.style.position = "absolute";
      self.canvas.style.top = 0;
      self.canvas.style.left = 0;
      self.canvas.style.backgroundColor = "white";
      self.canvas.style.visibility = "hidden";

      document.body.appendChild(self.canvas);

      self.ctx = self.canvas.getContext("2d");
      self.ctx.font = "48px serif";
      self.ctx.fillText("Hello world", 10, 50);
      
      // self.texture = self.ctx.texImage2D(self.ctx.TEXTURE_2D, 0, self.ctx.RGBA, self.ctx.RGBA, self.ctx.UNSIGNED_BYTE, self.canvas);
      // self.texture = self.ctx.createRenderBuffer();
      self.texture = self.ctx.getImageData(0,0,500,500);
        
      self.ref = self.target.ref.createShader(self.vertex, self.fragment);

      self.extractUniforms();

      for (let uniform of self.uniforms) {
        self.ref.setUniform(uniform.name, uniform.elements);

        for (let param of uniform.elements) {
          if (param.graph) self.parameter_graphs.push(param.graph);
        }
      }

      
      // prevents init() from being called twice
      self.ready = true;

      // removes 'tex0' from inputs, since it's provided
      // by the webcam stream.
      self.inputs = [];
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

      shader.setUniform("tex0", self.texture);
      shader.setUniform("resolution", [target.width, target.height]);

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
      update
    };
  });

const Text = types.compose(
  Shader,
  text
);
export default Text;
