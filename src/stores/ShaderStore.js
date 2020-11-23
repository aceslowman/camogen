import { NodeData } from "./NodeDataStore";
import {
  types,
  getSnapshot,
  applySnapshot,
  getParent,
  getRoot
} from "mobx-state-tree";
import * as DefaultShader from "./shaders/DefaultShader";
import Parameter from "./ParameterStore";
import uuidv1 from "uuid/v1";
import { OperatorGraph } from "./GraphStore";
// import ParameterGraph from './ParameterGraphStore';

const Uniform = types
  .model("Uniform", {
    uuid: types.identifier,
    name: types.maybe(types.string),
    elements: types.array(Parameter),
  })
  .volatile(self => ({
    shader: null
  }))
  .actions(self => ({
    afterCreate: () => {
      shader = getParent(self);
      console.log('shader', shader)
    },
    
    addElement: (name, value, type = "number") => {
      // TODO: if type is null, then decide type from value
      self.elements.push(
        Parameter.create({
          uuid: "param_" + uuidv1(),
          name: name,
          value: value,
          controlType: type,
          uniform: self
        })
      );
    }
  }));

let shader = types
  .model("Shader", {
    type: "Shader",
    uniforms: types.array(Uniform),
    name: types.maybe(types.string),
    precision: DefaultShader.precision,
    vert: DefaultShader.vert,
    frag: DefaultShader.frag,
    updateGroup: types.map(
      types.safeReference(types.late(() => OperatorGraph))
    ),
    hasChanged: types.optional(types.boolean, false),
    ready: false
  })
  .volatile(() => ({
    target: null
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

            TODO: currently MUST use doublequotes.
            TODO: allow for specific input types (slider, number, etc)
        */
    function extractUniforms() {
      const builtins = ["resolution"];

      let re = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9_]+);\s+\/?\/?\s?({(.*?)})?/g;
      let result = [...self.frag.matchAll(re)];

      // retain only uniforms that show up in the result set
      // self.uniforms = self.uniforms.filter(u => {
      //     return result.filter((e) => e.name === u.name).length > 0;
      // });

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

        let def;
        let opt = uniform_options ? JSON.parse(uniform_options) : {};

        let uniform = Uniform.create({
          uuid: uuidv1(),
          name: uniform_name,
          shader: self
        });
        // console.log(opt)

        switch (uniform_type) {
          case "sampler2D":
            self.inputs.push(uniform_name);
            break;
          case "float":
            def = opt.default ? opt.default : 1.0;

            uniform.addElement("", def, opt.type ? opt.type : "number");
            break;
          case "vec2":
            def = opt.default ? opt.default : [1, 1];

            uniform.addElement("x:", def[0], opt.type ? opt.type : "number");
            uniform.addElement("y:", def[1], opt.type ? opt.type : "number");
            break;
          case "vec3":
            def = opt.default ? opt.default : [1, 1, 1];

            uniform.addElement("x:", def[0], opt.type ? opt.type : "number");
            uniform.addElement("y:", def[1], opt.type ? opt.type : "number");
            uniform.addElement("z:", def[2], opt.type ? opt.type : "number");
            break;
          case "vec4":
            def = opt.default ? opt.default : [1, 1, 1, 1];

            uniform.addElement("x:", def[0], opt.type ? opt.type : "number");
            uniform.addElement("y:", def[1], opt.type ? opt.type : "number");
            uniform.addElement("z:", def[2], opt.type ? opt.type : "number");
            uniform.addElement("w:", def[3], opt.type ? opt.type : "number");
            break;
          case "bool":
            def = opt.default ? opt.default : false;
            uniform.addElement("", def, opt.type ? opt.type : "number");
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
      // self.parameterUpdateGroup.forEach((e) => e.afterUpdate())
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
        let input_shader = parent_node.parents[i].data;

        if (input_shader) {
          let input_target = input_shader.target.ref;
          shader.setUniform(self.inputs[i], input_target);
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
    }

    /*
            onRemove()

            removes the shader node (parent) from
            the associated target
        */
    function onRemove() {
      self.target.removeShaderNode(parent_node);
    }

    function save() {
      //             let path = `${app.getPath("userData")}/shaders`;
      //             let options = {
      //                 title: 'Save Shader File',
      //                 defaultPath: path,
      //                 buttonLabel: "Save",
      //                 filters: [{
      //                     name: 'Shader File',
      //                     // extensions: ['scene.camo']
      //                 }, ]
      //             }
      //             dialog.showSaveDialog(options).then((f) => {
      //                 if (!f.filePath) return;
      //                 let name = f.filePath.split('/').pop().split('.')[0];
      //                 let content = JSON.stringify(getSnapshot(self), (key,value)=>{
      //                     if (
      //                         key === 'uniforms' ||
      //                         key === 'inputs' ||
      //                         key === 'outputs' ||
      //                         key === 'ready' ||
      //                         key === 'hasChanged' ||
      //                         key === 'updateGroup'
      //                     ) return undefined;
      //                     if(key === 'name') return name;
      //                     return value;
      //                 }, 5);
      //                 fs.writeFile(f.filePath, content, (err) => {
      //                     if (err) {
      //                         console.error("an error has occurred: " + err.message);
      //                     } else {
      //                         console.log('scene has been saved at file:/' + f.filePath)
      //                         console.log(name)
      //                         self.setName(name);
      //                         parent_node.setName(name);
      //                         // reload or add to collection
      //                         const root_store = getRoot(self);
      //                         root_store.fetchShaderFiles();
      //                         self.setHasChanged(false);
      //                     }
      //                 });
      //             }).catch(err => console.error(err));
    }

    function setHasChanged(v) {
      self.hasChanged = v;
    }

    function load() {
      //             let path = `${app.getPath("userData")}/shaders`;
      //             let options = {
      //                 title: 'Load Shader File',
      //                 defaultPath: path,
      //                 buttonLabel: "Load",
      //                 filters: [{
      //                     name: 'Shader File',
      //                     // extensions: ['scene.camo']
      //                 }, ]
      //             }
      //             dialog.showOpenDialog(options).then((f) => {
      //                 let content = f.filePaths[0];
      //                 fs.readFile(content, 'utf-8', (err, data) => {
      //                     if (err) console.error(err.message);
      //                     // only deserialize scene.
      //                     applySnapshot(self.scene, JSON.parse(data).scene);
      //                     // undoManager.clear();
      //                 })
      //             }).catch(err => { /*alert(err)*/ });
    }

    function addToUpdateGroup(p_graph) {
      self.updateGroup.put(p_graph);
      return p_graph;
    }

    function beforeDestroy() {
      console.log("about to delete shader " + self.name);
    }

    return {
      beforeDestroy,
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
      addToUpdateGroup
    };
  });

const Shader = types.compose(
  "Shader",
  NodeData,
  shader
);

export { Uniform };
export default Shader;
