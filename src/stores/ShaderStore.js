import { NodeData } from "./NodeDataStore";
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

    addElement: (name, value, options) => {
      self.controlType = options.type ? options.type.toUpperCase() : "NORMAL";

      self.elements.push(
        Parameter.create({
          uuid: "param_" + nanoid(),
          name: name,
          value: value,
          uniform: self
        })
      );
    },
    
    addFloat: (value, options) => {
      self.type = "FLOAT";
      self.addElement("", value, options);
    },
    
    addInt: (value, options) => {
      self.type = "INT";
      self.addElement("", value, options);
    },

    addVec2: (value, options) => {
      self.type = "FLOAT";
      self.addElement("x:", value[0], options);
      self.addElement("y:", value[1], options);
    },

    addVec3: (value, options) => {
      self.type = "FLOAT";
      self.addElement("x:", value[0], options);
      self.addElement("y:", value[1], options);
      self.addElement("z:", value[2], options);
    },

    addVec4: (value, options) => {
      self.type = "FLOAT";
      self.addElement("x:", value[0], options);
      self.addElement("y:", value[1], options);
      self.addElement("z:", value[2], options);
      self.addElement("w:", value[3], options);
    },

    addBool: (value, options) => {
      self.type = "BOOL";
      self.addElement("", value, options);
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
    updateGroup: types.map(types.safeReference(types.late(() => OperatorGraph))),
    // BIG TODO!
    // collection: types.safeReference(types.late(() => Collection))
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
    }
  }))
  .actions(self => {
    let parent_node;

    function afterAttach() {
      parent_node = getParent(self);
    }

    function afterCreate() {
      self.ready = false; // initializing?
      self.hasChanged = false;
    }

    function init() {
      // create shader for given target
      self.ref = self.target.ref.createShader(self.vertex, self.fragment);

      // extract and assign uniforms to shader
      extractUniforms();

      for (let uniform of self.uniforms) {
        self.ref.setUniform(uniform.name, uniform.elements);
      }

      // flag as ready to render
      self.ready = true;
      return self;
    }

    /*
        extractUniforms()

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
    */
    function extractUniforms() {
      const builtins = ["resolution"];

      let regex = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9_]+);\s+\/?\/?\s?({(.*?)})?/g;
      let result = [...self.frag.matchAll(regex)];
      
      console.group('extracting uniforms');
      console.log('uniforms before', getSnapshot(self.uniforms))
      console.groupEnd()
      
      // if uniforms already exist, use them, and default to their values
      // TODO

      // retain only uniforms that show up in the result set
      self.uniforms = self.uniforms.filter(u => {
        return result.filter(e => e.name === u.name).length > 0;
      });

      result.forEach(e => {
        let uniform_type = e[2];
        let uniform_name = e[3];
        let uniform_options = e[4];

        // ignore built-ins
        if (builtins.includes(uniform_name)) return;

        // ignore if uniform already exists
        for (let i = 0; i < self.uniforms.length; i++) {
          if (self.uniforms[i].name === uniform_name) {
            return;
          }
        }

        // ignore if input already exists
        for (let i = 0; i < self.inputs.length; i++) {
          if (self.inputs[i] === uniform_name) {
            return;
          }
        }

        let value;
        let opt = {};

        // replace all single quotes in options with double quotes
        if (uniform_options) {
          opt = JSON.parse(uniform_options.replace(/'/g, '"'));
        }

        let uniform = Uniform.create({
          uuid: nanoid(),
          name: uniform_name,
          shader: self
        });

        switch (uniform_type) {
          case "sampler2D":
            self.inputs.push(uniform_name);
            parent_node.mapInputsToParents();
            break;
          case "int":
            value = opt.default ? opt.default : 1;
            uniform.addInt(value, opt);
            break;
          case "float":
            value = opt.default ? opt.default : 1.0;
            uniform.addFloat(value, opt);
            break;
          case "vec2":
            value = opt.default ? opt.default : [1, 1];
            uniform.addVec2(value, opt);
            break;
          case "vec3":
            value = opt.default ? opt.default : [1, 1, 1];
            uniform.addVec3(value, opt);
            break;
          case "vec4":
            value = opt.default ? opt.default : [1, 1, 1, 1];
            uniform.addVec4(value, opt);
            break;
          case "bool":
            value = opt.default ? opt.default : false;
            uniform.addBool(value, opt);
            break;
          default:
            break;
        }

        if (uniform.elements.length) self.uniforms.push(uniform);
      });
    }

    function setTarget(target) {
      self.target = target;
    }

    /*
        update(p5_instance)

        this method is triggered within Runner.js
        and draws shaders to quads.
    */
    function update(p) {
      if (!self.ready) return;

      let shader = self.ref;
      let target = self.target.ref;

      /* 
          Loop through all active parameter graphs to recompute 
          values in sync with the frame rate
      */
      self.updateGroup.forEach(e => e.afterUpdate());

      for (let uniform_data of self.uniforms) {
        if (uniform_data.elements.length > 1) {
          let elements = uniform_data.elements.map(e => e.value);
          shader.setUniform(uniform_data.name, elements);
        } else {
          shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
        }
      }

      // setup samplers
      for (let i = 0; i < self.inputs.length; i++) {
        //error
        if (parent_node.parents[i]) {
          let input_shader = parent_node.parents[i].data;

          if (input_shader) {
            let input_target = input_shader.target.ref;
            shader.setUniform(self.inputs[i], input_target);
          }
        } else {
          console.log("not enough parents!", i);
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
    }

    function setVert(v) {
      self.vert = v;
      self.hasChanged = true;
    }

    function setFrag(v) {
      self.frag = v;
      self.hasChanged = true;
    }

    function setName(n) {
      self.name = n;
      parent_node.setName(n);
    }

    function onRemove() {
      self.target.removeShaderNode(parent_node);
    }

    function setHasChanged(v) {
      self.hasChanged = v;
    }
    
    function saveToCollection() {
      console.log('saving to collection', self)
      if(self.collection) {
        self.collection.setData(self);
      }
    }

    function save() {
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
    }

    function load() {
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
    }

    function clear() {
      applySnapshot(self, DefaultShader);
    }

    function addToUpdateGroup(p_graph) {
      self.updateGroup.put(p_graph);
      return p_graph;
    }
    
    const setCollection = c => self.collection = c;

    return {
      afterCreate,
      afterAttach,
      init,
      extractUniforms,
      setVert,
      setFrag,
      setTarget,
      setName,
      update,
      onRemove,
      save,
      load,
      setHasChanged,
      clear,
      addToUpdateGroup,
      setCollection,
      saveToCollection
    };
  });

const Shader = types.compose(
  "Shader",
  NodeData,
  shader
);

export { Uniform };
export default Shader;
