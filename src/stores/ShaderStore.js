import {
    // createModelSchema,
    primitive,
    list,
    object,
    serialize,
    update,
    // reference,
    // identifier,
    serializable,
    // custom, 
    getDefaultModelSchema
} from "serializr";
import {
    observable,
    computed,
    action
} from 'mobx';
import UniformStore from './UniformStore';
import Parameter from './ParameterStore';
import Uniform from './UniformStore';
import NodeDataStore, { NodeData } from './NodeDataStore';
import { types } from "mobx-state-tree";
import * as DefaultShader from './shaders/DefaultShader';
import { Target } from "./TargetStore";
// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app    = remote.app;
const fs     = window.require('fs');

export default class ShaderStore extends NodeDataStore {    
    @serializable(list(object(UniformStore.schema)))
    @observable uniforms  = [];

    @serializable(primitive())
    @observable precision = "";
    
    @serializable(primitive())
    @observable vert      = "";
    
    @serializable(primitive())
    @observable frag      = "";

    @observable ref       = null; 

    @observable target    = null;

    @observable operatorUpdateGroup = [];

    @observable selectedParameter = null;

    @observable ready = null;

    @observable inputs = [];

    constructor(
        target, 
        precision = null, 
        vert = null, 
        frag = null, 
        uniforms = [],
        node = null,
    ) {       
        super(node);
        
        this.target = target; 
        this.precision = precision;
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms; 

        this.extractUniforms();
    }

    /*
        init()

        initializes shader

        the target needs to be assigned before
        this function is called.

        it is currently being triggered during
        ShaderGraphStore.afterUpdate(), but I'm 
        not entirely sure where it should end up.
    */
    @action init() {
        // create shader for given target
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        )

        // extract and assign uniforms to shader
        this.extractUniforms();

        for (let uniform of this.uniforms) {
            this.ref.setUniform(uniform.name, uniform.elements);
        }

        // flag as ready to render
        this.ready = true;
        return this;
    }

    /*
        sync()

        synchronizes the shader with it's graph, updating
        the shader target 

        this is called in ShaderGraphStore.afterUpdate(),
        following each tree traversal
    */
    @action sync() {
        this.extractUniforms();
        if(!this.node) {
            console.error('There is no parent node for this shader!', this)
        }

        this.node.mapInputsToParents();
    }

    /*
        update(p5_instance)

        this method is triggered within Runner.js
        and draws shaders to quads.
    */
    update(p) {
        if(!this.ready) return;

        let shader = this.ref;
        let target = this.target.ref;

        /* 
            Loop through all active parameter graphs to recompute 
            values in sync with the frame rate
        */
        for (let op of this.operatorUpdateGroup) {
            op.update();
            op.node.graph.recalculate();
        }

        for (let uniform_data of this.uniforms) {
            if (uniform_data.elements.length > 1) {

                // there should be a more elegant way of doing this
                let elements = [];

                for (let element of uniform_data.elements) {
                    elements.push(element.value);
                }

                shader.setUniform(uniform_data.name, elements);
            } else {
                shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
            }
        }

        // setup samplers
        for (let i = 0; i < this.inputs.length; i++) {
            let input_shader = this.node.parents[i].data;

            if (input_shader) {
                let input_target = input_shader.target.ref;
                shader.setUniform(this.inputs[i], input_target);
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
    @action extractUniforms() { 
        const builtins = ["resolution"];
        
        let re = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9_]+);\s+\/?\/?\s?({(.*?)})?/g;
        let result = [...this.frag.matchAll(re)];

        // retain only uniforms that show up in the result set
        this.uniforms = this.uniforms.filter(u => {
            let match;
            return result.forEach((e) => {
                match = e.includes(u.name);
                return match;
            });             
        });
        
        result.forEach((e) => {
            let uniform_type    = e[2];
            let uniform_name    = e[3];
            let uniform_options = e[4];

            // ignore built-ins
            if (builtins.includes(uniform_name)) return;

            // ignore if uniform already exists (preserves graphs)          
            // for(let i = 0; i < this.uniforms.length; i++){
            //     console.log([this.uniforms[i].name, uniform_name])
            //     // ignore if necessary
            //     if (this.uniforms[i].name === uniform_name) {
            //         return;
            //     }
            //     // remove if necessary
            // }

            // ignore if input already exists (preserves graphs)          
            for (let i = 0; i < this.inputs.length; i++) {
                // console.log([this.inlets[i].name, uniform_name])
                if (this.inputs[i] === uniform_name) {
                    return;
                }
            }
 
            let def;
            let opt = (uniform_options) ? JSON.parse(uniform_options) : {};
            // console.log('opt',opt)

            let uniform = new Uniform(uniform_name,this);

            switch(uniform_type){
                case "sampler2D":
                    /*
                        the inputs here should correspond 
                        with the parent and child arrays
                        in the parent node.

                        the parent node will need to re-sync
                        with the input... need to fix
                    */
                    this.inputs.push(uniform_name)
                    break;
                case "float":          
                    // console.log(e[3], e)
                    def = opt.default ? opt.default : 1.0;

                    uniform.elements.push(new Parameter('', def, uniform));
                    break;
                case "vec2":                  
                    def = opt.default ? opt.default : [1,1];
                    
                    uniform.elements.push(new Parameter('x:', def[0], uniform));
                    uniform.elements.push(new Parameter('y:', def[1], uniform));
                    break;
                case "vec3":                  
                    def = opt.default ? opt.default : [1,1,1];
                    
                    uniform.elements.push(new Parameter('x:', def[0], uniform));
                    uniform.elements.push(new Parameter('y:', def[1], uniform));
                    uniform.elements.push(new Parameter('z:', def[2], uniform));
                    break;
                case "vec4":                  
                    def = opt.default ? opt.default : [1,1,1,1];
                    
                    uniform.elements.push(new Parameter('x:', def[0], uniform));
                    uniform.elements.push(new Parameter('y:', def[1], uniform));
                    uniform.elements.push(new Parameter('z:', def[2], uniform));
                    uniform.elements.push(new Parameter('w:', def[3], uniform));
                    break;
                case "bool":                   
                    def = opt.default ? opt.default : false;

                    uniform.elements.push(new Parameter('', def, uniform));
                    break;
                default:
                    // console.log('check here',e)
                    break;
            }

            this.uniforms.push(uniform);
        })
    }

    @action async save() {        
        let path = `${app.getPath("userData")}/shaders`;

        const show_dialog = true;

        if (show_dialog) {
            let options = {
                title: this.name + '.shader',
                defaultPath: path,
                buttonLabel: "Save Shader File",
            }

            dialog.showSaveDialog(options).then((f) => {
                // change name of shader to name provided in save dialog
                this.name = f.filePath.split('/').pop();
                this.node.name = this.name;

                // rerender elements
                this.node.graph.updateFlag = !this.node.graph.updateFlag;

                let content = JSON.stringify(serialize(ShaderStore.schema, this));

                fs.writeFile(f.filePath, content, (err) => {
                    if (err) {
                        console.log("an error has occurred: " + err.message);
                    } else {
                        this.target.parent.loadShaderFiles();
                    }      
                });
            }).catch(err => {
                console.error(err)
            });
        } else {
            let content = JSON.stringify(serialize(ShaderStore.schema, this));

            let file = this.name + '.shader';

            fs.writeFile(`path/${file}`, content, (err, data) => {
                if (err) {
                    console.log("an error has occurred: " + err.message);
                } else {
                    console.log('saved!', data);
                }
            });
        }    
    }

    /*
        load()

        not currently in use. allows a shader to be loaded
        from file. this isn't really necessary, as saved
        shaders will be available in the library as soon as
        they are saved.
    */
    @action load() {
        let path = `${app.getPath("userData")}/shaders`;
        
        let options = {
            title: this.name + '.shader',
            defaultPath: path,
            buttonLabel: "Load Shader File",
        }

        dialog.showOpenDialog(options).then((f) => {
            let content = f.filePaths[0];
            if(!content) return;

            fs.readFile(content, 'utf-8', (err, data) => {
                if (err)
                    alert("an error has occurred: " + err.message);

                update(
                    this,
                    this,
                    JSON.parse(data),
                    (err, item) => {
                        if (err) console.error(err)
                    }, {
                        target: this.target
                    }
                )
            })
        }).catch(err => {
            console.error(err);
        });
    }

    @action onRemove() {
        this.target.removeShader(this);
    }

    @computed get vertex() {
        return this.precision + this.vert;
    }

    @computed get fragment() {
        return this.precision + this.frag;
    }

    @computed get isBeingEdited() {
        return this === this.node.graph.currentlyEditing;
    }
}

ShaderStore.schema = {
    factory: c => {
        let target = c.parentContext ? c.parentContext.target : null;
        
        return new ShaderStore(
            target,
            c.json.precision,
            c.json.vert,
            c.json.frag,
            c.json.uniforms,
            c.args ? c.args.node : null            
        );
    },
    extends: getDefaultModelSchema(NodeDataStore),
    props: getDefaultModelSchema(ShaderStore).props
}

let shader = types
    .model("Shader", {
        // uniforms: [],
        precision: types.optional(types.string, DefaultShader.precision),
        vert: types.optional(types.string, DefaultShader.vert),
        frag: types.optional(types.string, DefaultShader.frag),
        // ref: null,
        target: types.maybe(Target),
        ready: false,
    })
    .actions(self => {
        // let node = self.parent.value;

        function afterCreate() {
            // console.log('self',self)
            // console.log('node', node)
        }

        return {
            afterCreate
        }
    })

// extends Graph!
const Shader = types.compose(NodeData, shader);

export { Shader }