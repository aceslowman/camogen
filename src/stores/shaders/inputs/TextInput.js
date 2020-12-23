import { getRoot, types, getSnapshot, getParent } from "mobx-state-tree";
import { autorun } from 'mobx';
import Shader from "../../ShaderStore";
import * as DefaultShader from "../defaults/DefaultShader";

const text = types
  .model("Text", {
    type: "TextInput",
    name: "Text", //TODO get rid of this, only need type
    content: "Hell World",
    fontFamily: "Arial",
    fontSize: 40,
    clearColor: "#000000",
    fillColor: "#ffffff",
    strokeColor: "#000000",
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

      self.canvas.id = "TextLayer";
      self.canvas.width = p.width || 50;
      self.canvas.height = p.height || 50;
      self.canvas.style.position = "absolute";
      self.canvas.style.top = 0;
      self.canvas.style.left = 0;
      self.canvas.style.visibility = "hidden";

      document.body.appendChild(self.canvas);

      self.ctx = self.canvas.getContext("2d");
      self.ctx.font = `${self.fontSize}px ${self.fontFamily}`;
      self.ctx.fillStyle = self.fillColor;
      self.ctx.textBaseline = "top";


      self.ctx.fillText(self.content, 0, 0, self.canvas.width);

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

      console.log("self", getSnapshot(self));
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
      self.ctx.fillStyle = self.clearColor;
      // self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.ctx.fillRect(0,0,self.canvas.width, self.canvas.height);
      
      self.ctx.fillStyle = self.fillColor;
      
      wrapText(self.content, 0, 0, self.canvas.width);
      // self.ctx.fillText(self.content, 10, 50, self.canvas.width);

      self.texture = self.ctx.getImageData(
        0,
        0,
        self.canvas.width,
        self.canvas.height
      );
    }
    
    
    //https://riptutorial.com/html5-canvas/example/18590/wrapping-text-into-paragraphs
    function wrapText(text, x, y, maxWidth){
      var firstY=y;
      var words = text.split(' ');
      var line = '';
      var lineHeight=self.fontSize *1.286; // a good approx for 10-18px sizes

      self.ctx.font = `${self.fontSize}px ${self.fontFamily}`;
      self.ctx.textBaseline='top';

      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = self.ctx.measureText(testLine);
        var testWidth = metrics.width;
        if(testWidth > maxWidth) {
          self.ctx.fillText(line, x, y);
          if(n<words.length-1){
              line = words[n] + ' ';
              y += lineHeight;
          }
        }
        else {
          line = testLine;
        }
      }
      self.ctx.fillText(line, x, y);
    }

    function setContent(text) {
      self.content = text;
      self.redraw();
    }

    function setFontFamily(v) {
      self.fontFamily = v;
      self.ctx.font = `${self.fontSize}px ${v}`;
      self.redraw();
    }

    function setFontSize(v) {
      self.fontSize = v;
      self.ctx.font = `${v}px ${self.fontFamily}`;
      self.redraw();
    }

    function setFillColor(v) {
      self.fillColor = v;
      self.ctx.fillStyle = v;
      self.redraw();
    }

    function setStrokeColor(v) {
      self.strokeColor = v;
      self.ctx.strokeStyle = v;
      self.redraw();
    }

    return {
      afterAttach,
      beforeDestroy,
      setContent,
      init,
      update,
      redraw,
      setFontFamily,
      setFontSize,
      setFillColor,
      setStrokeColor
    };
  });

const Text = types.compose(
  Shader,
  text
);
export default Text;
