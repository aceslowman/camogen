import { getRoot, types, getSnapshot, getParent } from "mobx-state-tree";
import { autorun } from 'mobx';
import Shader from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";

const sketch = types
  .model("Sketch", {
    type: "SketchInput",
    name: "Sketch", //TODO get rid of this, only need type
    brushColor: "#000000",
    brushSize: 10,
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
    texture: null,
    canvas: null,
    ctx: null
  }))
  .actions(self => {
    let root_store;
    let parent_node;
    let resize_autorun;

    function afterAttach() {
      root_store = getRoot(self);
      parent_node = getParent(self);
      
      // before destroy this autorun has to be disposed of
      resize_autorun = autorun(() => {
        console.log('width has changed?', root_store.width);
        self.canvas.width = root_store.width;
        self.canvas.height = root_store.height;
        
        self.redraw();
      })
    }
    
    function beforeDestroy() {
      // dispose of the autorun10l
      resize_autorun();
    }

    function init() {
      let p = root_store.p5_instance;

      self.canvas = document.createElement("canvas");

      self.canvas.id = "SketchLayer";
      self.canvas.width = p.width || 50;
      self.canvas.height = p.height || 50;
      self.canvas.style.position = "absolute";
      self.canvas.style.top = 0;
      self.canvas.style.left = 0;
      self.canvas.style.visibility = "hidden";

      document.body.appendChild(self.canvas);

      // begin graphics
      self.ctx = self.canvas.getContext("2d");
      self.ctx.fillStyle = self.brushColor;

      self.texture = self.ctx.getImageData(
        0,
        0,
        self.canvas.width,
        self.canvas.height
      );

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
      
      // TODO: fix this
      // removes 'tex0' from inputs, since it's provided
      // by the text canvas.
      self.inputs = [];
      parent_node.mapInputsToParents();
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

    function redraw() {
      
      // TEMPORARY: should provide a way to allow clear/noClear
      self.ctx.fillStyle = self.brushColor;
      // self.ctx.fillRect(0,0,self.canvas.width, self.canvas.height);
      
      self.ctx.fillStyle = self.fillColor;

      self.texture = self.ctx.getImageData(
        0,
        0,
        self.canvas.width,
        self.canvas.height
      );
    }

    function setBrushColor(v) {
      self.brushColor = v;
      self.ctx.fillStyle = v;
      // self.redraw();
    }
    
    function setBrushSize(v) {
      self.brushSize = v;
      // self.ctx.fillStyle = v;
      // self.redraw();
    }

    return {
      afterAttach,
      beforeDestroy,
      init,
      update,
      redraw,
      setBrushColor,
      setBrushSize
    };
  });

const Sketch = types.compose(
  Shader,
  sketch
);
export default Sketch;
