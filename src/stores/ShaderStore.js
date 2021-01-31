import { NodeData } from "./NodeDataStore";
import { undoManager } from "./GraphStore";
import {
  types,
  getSnapshot,
  applySnapshot,
  getParent,
  getRoot
} from "mobx-state-tree";
import * as DefaultShader from "./shaders/defaults/DefaultShader";
import Parameter from "./ParameterStore";
import Collection from "./utils/Collection";
import { nanoid } from "nanoid";
import { OperatorGraph } from "./GraphStore";
import Target from "./TargetStore";

const Uniform = types
  .model("Uniform", {
    uuid: types.identifier,
    name: types.maybe(types.string),
    elements: types.array(Parameter),
    type: types.maybe(
      types.enumeration("Type", [
        "FLOAT",
        "INT",
        "VEC2",
        "VEC3",
        "VEC4",
        "BOOL"
      ])
    ),
    controlType: types.maybe(
      types.enumeration("ControlType", ["NORMAL", "SLIDER"])
    )
  })
  .volatile(self => ({
    shader: null
  }))
  .actions(self => ({
    afterAttach: () => {
      self.shader = getParent(self, 2);
    },

    addElement: (name, value, defaultValue, options) => {
      self.controlType = options.type ? options.type.toUpperCase() : "NORMAL";

      self.elements.push(
        Parameter.create({
          uuid: "param_" + nanoid(),
          name: name,
          value: value,
          uniform: self,
          default: value
        })
      );
    },

    addFloat: (value, options) => {
      self.type = "FLOAT";
      self.addElement("", value, options.default, options);
    },

    addInt: (value, options) => {
      self.type = "INT";
      self.addElement("", value, options.default, options);
    },

    addVec2: (value, options) => {
      self.type = "VEC2";
      self.addElement("x:", value[0], options.default[0], options);
      self.addElement("y:", value[1], options.default[1], options);
    },

    addVec3: (value, options) => {
      self.type = "VEC3";
      self.addElement("x:", value[0], options.default[0], options);
      self.addElement("y:", value[1], options.default[1], options);
      self.addElement("z:", value[2], options.default[2], options);
    },

    addVec4: (value, options) => {
      self.type = "VEC4";
      self.addElement("x:", value[0], options.default[0], options);
      self.addElement("y:", value[1], options.default[1], options);
      self.addElement("z:", value[2], options.default[2], options);
      self.addElement("w:", value[3], options.default[3], options);
    },

    addBool: (value, options) => {
      self.type = "BOOL";
      self.addElement("", value, options.default, options);      
    }

    // TODO: mat2, mat3, mat4, sampler2D and samplerCube
  }));

let shader = types
  .model("Shader", {
    type: "Shader",
    uniforms: types.array(Uniform),
    name: types.maybe(types.string),
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    frag: DefaultShader.frag,
    // operatorGraphs: types.map(types.late(() => OperatorGraph)),
    operatorGraphs: types.map(
      types.safeReference(types.late(() => OperatorGraph))
    )
  })
  .volatile(() => ({
    target: null,
    ready: false,
    hasChanged: false
  }))
  .views(self => ({
    get vertex() {
      return self.vert;
    },

    get fragment() {
      return self.precision + self.frag;
    },

    getUniform: name => {
      let uniform = null;
      self.uniforms.forEach((e, i) => {
        if (e.name === name) uniform = e;
      });

      return uniform;
    }
  }))
  .actions(self => {
    let parent_node;

    return {
      afterAttach: () => {
        parent_node = getParent(self);
      },

      afterCreate: () => {
        self.ready = false;
        self.hasChanged = false;
      },

      refresh: () => {
        self.ref = self.target.ref.createShader(self.vertex, self.fragment);
      },

      init: () => {
        // create shader for given target
        self.ref = self.target.ref.createShader(self.vertex, self.fragment);

        // extract and assign uniforms to shader
        self.extractUniforms();

        for (let uniform of self.uniforms) {
          self.ref.setUniform(uniform.name, uniform.elements);
        }

        // flag as ready to render
        self.ready = true;
        return self;
      },

      extractUniforms: () => {
        /*
          extracts all uniform variables from
          shader code. these then populate the
          interfaces. controls and input elements
          are created here

          special options can be passed to a uniform
          to provide default values, and eventually
          annotations and UI knob/slider/dial type.

          camogen extracts: 
          0: "uniform vec2 offset; // {"name":"off","default":[0.0,0.0]}"
          1: "uniform"
          2: "vec2"
          3: "offset"
          4: "{"name":"off","default":[0.0,0.0]}"

          TODO: have to remove parents when they are no longer needed
          TODO: you should be able to write options both inline and as 
                a larger single object
        */

        // TODO: change to u_resolution, u_time, etc
        const builtins = ["resolution"];

        let regex = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9_]+);\s+\/?\/?\s?({(.*?)})?/g;
        let result = [...self.frag.matchAll(regex)].map(e => ({
          type: e[2],
          name: e[3],
          options: e[4]
        }));

        // remove all uniforms that aren't present in new result set
        // ie, removes uniforms that aren't needed anymore
        // I have a bug here!
        self.uniforms = self.uniforms.filter(u => {
          // name and type must match!
          return (
            result.filter(e => {
              // console.log(`comparing ${e.name}(${e.type.toLowerCase()}) to ${u.name}(${u.type})`);
              return (
                e.name === u.name &&
                e.type.toLowerCase() === u.type.toLowerCase()
              );
            }).length > 0
          );
        });

        // remove all inputs that aren't present in new result set
        self.inputs = self.inputs.filter(input => {
          return result.filter(e => e.name === input.name).length > 0;
        });

        for (let i = 0; i < result.length; i++) {
          let e = result[i];
          // ignore built-ins
          if (builtins.includes(e.name)) continue;

          /*
            NOTE: Array.forEach can't exit the calling function
            https://medium.com/@virtual_khan/javascript-foreach-a-return-will-not-exit-the-calling-function-cfbc6fa7b199
          */

          // ignore if uniform already exists (persist param values)
          for (let j = 0; j < self.uniforms.length; j++) {
            // console.log(`comparing ${self.uniforms[j].name} to ${e.name}`);
            if (
              self.uniforms[j].name === e.name &&
              self.uniforms[j].type.toLowerCase() === e.type.toLowerCase()
            )
              return;
          }

          // ignore if input already exists
          for (let i = 0; i < self.inputs.length; i++) {
            if (self.inputs[i] === e.name) return;
          }

          let value;
          let opt = {};

          // replace all single quotes in options with double quotes
          if (e.options) {
            opt = JSON.parse(e.options.replace(/'/g, '"'));
          }

          let uniform = Uniform.create({
            uuid: nanoid(),
            name: e.name,
            shader: self
          });

          switch (e.type) {
            case "sampler2D":
              self.inputs.push(e.name);
              parent_node.mapInputsToParents();
              break;
            case "int":
              value = opt.default ?? 1;
              uniform.addInt(value, opt);
              break;
            case "float":
              value = opt.default ?? 1.0;
              uniform.addFloat(value, opt);
              break;
            case "vec2":
              value = opt.default ?? [1, 1];
              uniform.addVec2(value, opt);
              break;
            case "vec3":
              value = opt.default ?? [1, 1, 1];
              uniform.addVec3(value, opt);
              break;
            case "vec4":
              value = opt.default ?? [1, 1, 1, 1];
              uniform.addVec4(value, opt);
              break;
            case "bool":
              value = opt.default ?? false;
              uniform.addBool(value, opt);
              break;
            default:
              break;
          }

          if (uniform.elements.length) self.uniforms.push(uniform);
        }

        if (!self.inputs.length) parent_node.mapInputsToParents();
      },

      update: p => {
        // skip if bypassed
        if (parent_node.bypass) return;
        /*
        this method is triggered within Runner.js
        and draws shaders to quads.
      */
        if (!self.ready) return;

        let shader = self.ref;
        let target = self.target.ref;

        /* 
          Loop through all active parameter graphs to recompute 
          values in sync with the frame rate
      */
        self.operatorGraphs.forEach(e => e.afterUpdate());

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

        // setup samplers
        for (let j = 0; j < self.inputs.length; j++) {
          // if parent exists
          if (j < parent_node.parents.length) {
            let input_shader = parent_node.parents[j].data;

            if (input_shader) {
              let input_target = input_shader.target.ref;
              shader.setUniform(self.inputs[j], input_target);
            }
          } else {
            // if parent doesn't exist, warn me, it's a buge
            console.log("not enough parents!", j);
            p.noLoop();
          }
        }

        shader.setUniform("resolution", [target.width, target.height]);

        target.shader(shader);

        try {
          target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        } catch (error) {
          console.error(error);
          p.noLoop();
        }
      },

      beforeDetach: () => {
        // console.log("detaching shader " + self.name);
        self.target.removeShaderNode(parent_node);
      },

      beforeDestroy: () => {
        // console.log("destroying shader!");
      },

      saveToCollection: () => {
        console.log("saving to collection", self);
        if (self.collection) {
          // remove uniforms before saving
          let new_data = getSnapshot(self);
          // delete new_data.uniforms;
          // new_data.uniforms = [];
          self.collection.setData({
            ...new_data,
            uniforms: []
          });
        }
      },

      save: () => {
        console.log("saving project");

        let src = JSON.stringify(getSnapshot(self));
        let blob = new Blob([src], { type: "text/plain" });

        let link = document.createElement("a");
        link.download = `${self.name}.shader.camo`;

        if (window.webkitURL != null) {
          // Chrome allows the link to be clicked without actually adding it to the DOM.
          link.href = window.webkitURL.createObjectURL(blob);
        } else {
          // Firefox requires the link to be added to the DOM before it can be clicked.
          link.href = window.URL.createObjectURL(blob);
          link.onclick = e => {
            document.body.removeChild(e.target);
          };
          link.style.display = "none";
          document.body.appendChild(link);
        }

        link.click();
      },

      load: () => {
        let link = document.createElement("input");
        link.type = "file";

        link.onchange = e => {
          var file = e.target.files[0];

          let reader = new FileReader();
          reader.readAsText(file, "UTF-8");

          reader.onload = e => {
            let content = JSON.parse(e.target.result);
            applySnapshot(self, content);
            parent_node.setName(content.name);
            // undoManager.clear();
            self.init();
          };
        };

        link.click();
      },

      clear: () => {
        applySnapshot(self, DefaultShader);
        self.name = "New Shader";
        parent_node.setName("New Shader");
        self.init();
      },
      
      resetToDefault: () => {
        self.uniforms.forEach(e => {
          e.elements.forEach(j => {
            j.resetToDefault();
          })
        })
      },

      addOperatorGraph: graph => {
        self.operatorGraphs.put(graph);
      },

      setVert: v => {
        self.vert = v;
        self.hasChanged = true;
      },

      setFrag: v => {
        self.frag = v;
        self.hasChanged = true;
      },

      setName: n => {
        self.name = n;
        parent_node.setName(n);
      },

      setCollection: c => (self.collection = c),
      setHasChanged: v => (self.hasChanged = v),
      setTarget: t => (self.target = t)
    };
  });

const Shader = types.compose(
  "Shader",
  NodeData,
  shader
);

export { Uniform };
export default Shader;
