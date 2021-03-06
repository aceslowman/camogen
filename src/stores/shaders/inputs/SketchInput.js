import { getRoot, types, getSnapshot, getParent } from "mobx-state-tree";
import { autorun } from "mobx";
import Shader from "../ShaderStore";
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
        self.canvas.width = root_store.width;
        self.canvas.height = root_store.height;

        self.redraw();
      });
    }

    function beforeDestroy() {
      // dispose of the autorun
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

      self.ready = true;

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
      self.texture = self.ctx.getImageData(
        0,
        0,
        self.canvas.width,
        self.canvas.height
      );
    }

    function drawLine(x1, y1, x2, y2) {
      self.ctx.beginPath();
      self.ctx.strokeStyle = self.brushColor;
      self.ctx.lineWidth = self.brushSize;
      self.ctx.moveTo(x1, y1);
      self.ctx.lineTo(x2, y2);
      self.ctx.stroke();
      self.ctx.closePath();
      self.redraw();
    }

    const setBrushColor = v => (self.brushColor = v);
    const setBrushSize = v => (self.brushSize = v);

    return {
      afterAttach,
      beforeDestroy,
      init,
      update,
      redraw,
      setBrushColor,
      setBrushSize,
      drawLine
    };
  });

const Sketch = types
  .compose(
    Shader,
    sketch
  )
  .named("SketchInput");

export default Sketch;
