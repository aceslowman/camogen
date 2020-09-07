import { NodeData } from './NodeDataStore';
import { types, getSnapshot } from "mobx-state-tree";
import * as DefaultShader from './shaders/DefaultShader';
import { Target } from "./TargetStore";

let shader = types
    .model("Shader", {
        uniforms: types.array(types.late(()=>Uniform)),
        // // uniforms: types.array(types.frozen()), // accepts anything for older shader files
        name: types.maybe(types.string), 
        precision: types.optional(types.string, DefaultShader.precision),
        vert: types.optional(types.string, DefaultShader.vert),
        frag: types.optional(types.string, DefaultShader.frag),
        // ref: null,
        target: types.maybe(Target),
    })
    .actions(self => {
        function afterAttach() {
            // extractUniforms()
        }

        function afterCreate() {
            // extractUniforms()
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
        */
        function extractUniforms() {
            const builtins = ["resolution"];

            let re = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9_]+);\s+\/?\/?\s?({(.*?)})?/g;
            let result = [...self.frag.matchAll(re)];
            // console.log('extracting', getSnapshot(self))

            // // retain only uniforms that show up in the result set
            self.uniforms = self.uniforms.filter(u => {
                let match;
                return result.forEach((e) => {
                    match = e.includes(u.name);
                    return match;
                });
            });

            result.forEach((e) => {
                let uniform_type = e[2];
                let uniform_name = e[3];
                let uniform_options = e[4];

                // ignore built-ins
                if (builtins.includes(uniform_name)) return;

                // ignore if uniform already exists (preserves graphs)          
                // for(let i = 0; i < self.uniforms.length; i++){
                //     console.log([self.uniforms[i].name, uniform_name])
                //     // ignore if necessary
                //     if (self.uniforms[i].name === uniform_name) {
                //         return;
                //     }
                //     // remove if necessary
                // }

                // ignore if input already exists (preserves graphs)          
                for (let i = 0; i < self.inputs.length; i++) {
                    // console.log([self.inlets[i].name, uniform_name])
                    if (self.inputs[i] === uniform_name) {
                        return;
                    }
                }

                let def;
                let opt = (uniform_options) ? JSON.parse(uniform_options) : {};
                // console.log('opt',opt)

                let uniform = Uniform.create({
                    name: uniform_name
                });

                switch (uniform_type) {
                    case "sampler2D":
                        /*
                            the inputs here should correspond 
                            with the parent and child arrays
                            in the parent node.

                            the parent node will need to re-sync
                            with the input... need to fix
                        */
                        self.inputs.push(uniform_name)
                        break;
                    case "float":
                        // console.log(e[3], e)
                        def = opt.default ? opt.default : 1.0;

                        uniform.addElement(Parameter.create({
                            name: '', 
                            value: def
                        }));
                        break;
                    case "vec2":
                        def = opt.default ? opt.default : [1, 1];

                        uniform.addElement(Parameter.create({
                            name: 'x:', 
                            value: def[0]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'y:', 
                            value: def[1]
                        }));
                        break;
                    case "vec3":
                        def = opt.default ? opt.default : [1, 1, 1];

                        uniform.addElement(Parameter.create({
                            name: 'x:', 
                            value: def[0]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'y:', 
                            value: def[1]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'z:', 
                            value: def[2]
                        }));
                        break;
                    case "vec4":
                        def = opt.default ? opt.default : [1, 1, 1, 1];

                        uniform.addElement(Parameter.create({
                            name: 'x:', 
                            value: def[0]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'y:', 
                            value: def[1]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'z:', 
                            value: def[2]
                        }));
                        uniform.addElement(Parameter.create({
                            name: 'w:', 
                            value: def[3]
                        }));
                        break;
                    case "bool":
                        def = opt.default ? opt.default : false;
                        uniform.addElement(Parameter.create({
                            name: '', 
                            value: def
                        }));
                        break;
                    default:
                        // console.log('check here',e)
                        break;
                }
                // console.log(uniform)
                if(uniform.elements.length) self.uniforms.push(uniform);
            })
        }

        return {
            afterAttach,
            afterCreate,
            extractUniforms
        }
    })

const Shader = types.compose(NodeData, shader);

export { Shader }

const Parameter = types
    .model("Parameter",{
        name: types.maybe(types.string),
        // value: types.maybe(types.union(types.number,types.boolean)),
        value: types.maybe(types.union(types.number, types.string, types.boolean)),
        // graph: types.maybe(ParameterGraph)
    })
    .actions(self => ({
        setValue: (v) => {
            self.value = v;
        }
    }))

const Uniform = types
    .model("Uniform", {
        name: types.maybe(types.string),
        elements: types.array(Parameter),
    })
    .actions(self => ({
        addElement: (el) => {
            self.elements.push(el)
        }
    }))