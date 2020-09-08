import { NodeData } from './NodeDataStore';
import { types, getSnapshot, getParent } from "mobx-state-tree";
import * as DefaultShader from './shaders/DefaultShader';
import { Target } from "./TargetStore";

const Parameter = types
    .model("Parameter", {
        name: types.maybe(types.string),
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

let shader = types
    .model("Shader", {
        uniforms: types.array(types.late(()=>Uniform)),
        name: types.maybe(types.string), 
        precision: types.optional(types.string, DefaultShader.precision),
        vert: types.optional(types.string, DefaultShader.vert),
        frag: types.optional(types.string, DefaultShader.frag),
        ready: false,
        target: types.maybe(types.reference(Target)),
    })
    .views(self => ({
        get vertex() {
            return self.precision + self.vert;
        },

        get fragment() {
            return self.precision + self.frag;
        },
    }))
    .actions(self => {
        let parent_node;

        function afterAttach() {
            parent_node = getParent(self);
        }

        function init() {
            // create shader for given target
            self.ref = self.target.ref.createShader(
                self.vertex,
                self.fragment
            )

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
            // for (let op of self.operatorUpdateGroup) {
            //     op.update();
            //     op.node.graph.recalculate();
            // }

            for (let uniform_data of self.uniforms) {
                if (uniform_data.elements.length > 1) {                    
                    let elements = uniform_data.elements.map((e) => e.value);
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

            shader.setUniform('resolution', [target.width, target.height]);

            target.shader(shader);

            try {
                target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
            } catch (error) {
                console.error(error);
                p.noLoop();
            }
        }

        /*
            onRemove()

            removes the shader node (parent) from
            the associated target
        */
        function onRemove() {
            self.target.removeShaderNode(parent_node);
        }

        return {
            afterAttach,
            init,
            extractUniforms,
            setTarget,            
            update,            
            onRemove,
        }
    })

const Shader = types.compose(NodeData, shader);

export { Shader }