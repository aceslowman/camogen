import React from 'react';
import {
    createModelSchema,
    primitive,
    list,
    object,
    serialize,
    update,
    // reference,
    identifier,
} from "serializr";
import {
    observable,
    computed,
    decorate,
    action
} from 'mobx';

import uuidv1 from 'uuid/v1';
import UniformStore from './UniformStore';
import Parameter from './ParameterStore';
import Uniform from './UniformStore';
import UniformComponent from '../components/UniformComponent';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app    = remote.app;
const fs     = window.require('fs');

class ShaderStore {
    uuid      = uuidv1();
    name      = "";
    uniforms  = [];
    precision = "";
    vert      = "";
    frag      = "";
    ref       = null;
    // component = null;
    controls  = [];
    target    = null;
    node      = null;

    inputs  = [];
    outputs = ["out"];

    operatorUpdateGroup = [];

    constructor(
        target, 
        precision = null, 
        vert = null, 
        frag = null, 
        uniforms = []
    ) {        
        this.target = target; 
        this.precision = precision;
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms;
        
        this.extractUniforms();
    }

    init() {
        this.parameter_graphs = [];
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        );

        this.extractUniforms();

        for (let uniform of this.uniforms) {
            this.ref.setUniform(uniform.name, uniform.elements);

            for (let param of uniform.elements) {
                if (param.graph)
                    this.parameter_graphs.push(param.graph)
            }
        }

        this.controls = this.uniforms.map((uniform)=>{                        
            return (
                <UniformComponent                     
                    key={uniform.uuid}
                    data={uniform}
                    activeParam={
                        this.node.editingParam
                    }	
                    onDblClick={
                        (e) => this.node.editingParam = e
                    }
                />
            );                     
        });

        return this;
    }

    update(p) {
        let shader = this.ref;
        let target = this.target.ref;

        /* 
            Loop through all active parameter graphs to recompute 
            values in sync with the frame rate
        */
        for (let op of this.operatorUpdateGroup) {
            op.update();
            op.parent.update();
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

        // setup inputs
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
            console.log('frag', shader)
            p.noLoop();
        }
    }

    load() {
        dialog.showOpenDialog().then((f) => {
            let content = f.filePaths[0];
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

    extractUniforms() { 
        const builtins = ["resolution"];
        
        let re = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9]+);\s+\/?\/?\s?({(.*?)})?/g
        let result = [...this.frag.matchAll(re)];
       
        this.uniforms = this.uniforms.filter(u => {
            let match;
            result.forEach((e) => {
                match = e.includes(u.name);
            });
            return match;     
        });
        
        result.forEach((e) => {
            // ignore built-ins
            if(builtins.includes(e[3])) return;

            // ignore if uniform already exists (preserves graphs)          
            for(let i = 0; i < this.uniforms.length; i++){
                // console.log([this.uniforms[i].name, e[3]])
                // ignore if necessary
                if(this.uniforms[i].name === e[3]){
                    return;
                }
                // remove if necessary
            }

            // ignore if uniform already exists (preserves graphs)          
            for (let i = 0; i < this.inputs.length; i++) {
                // console.log([this.inlets[i].name, e[3]])
                if (this.inputs[i] === e[3]) {
                    return;
                }
            }

            let def;
            let opt = (e[4]) ? JSON.parse(e[4]) : {};

            switch(e[2]){
                case "sampler2D":
                    /*
                        the inputs here should correspond 
                        with the parent and child arrays
                        in the parent node.
                    */
                    this.inputs.push(e[3])
                    break;
                case "float":                                      
                    def = opt.default ? opt.default : 1.0;

                    this.uniforms.push(new Uniform(e[3], [
                        new Parameter('',def)
                    ], this));
                    break;
                case "vec2":                  
                    def = opt.default ? opt.default : [1,1];
                    
                    this.uniforms.push(new Uniform(e[3], [
                        new Parameter('x:',def[0]),
                        new Parameter('y:',def[1])
                    ], this));
                    break;
                case "vec3":                  
                    def = opt.default ? opt.default : [1,1,1];
                    
                    this.uniforms.push(new Uniform(e[3], [
                        new Parameter('x:',def[0]),
                        new Parameter('y:', def[1]),
                        new Parameter('z:', def[2])
                    ], this));
                    break;
                case "vec4":                  
                    def = opt.default ? opt.default : [1,1,1,1];
                    
                    this.uniforms.push(new Uniform(e[3], [
                        new Parameter('x:',def[0]),
                        new Parameter('y:', def[1]),
                        new Parameter('z:', def[2]),
                        new Parameter('w:', def[3])
                    ], this));
                    break;
                case "bool":                   
                    def = opt.default ? opt.default : false;

                    this.uniforms.push(new Uniform(e[3], [
                        new Parameter('',def)
                    ], this));
                    break;
                default:
                    break;
            }
        })
    }

    async save() {        
        let path = `${app.getPath("userData")}/shaders`;

        const show_dialog = true;

        if (show_dialog) {
            let options = {
                title: this.name + '.shader',
                defaultPath: path,
                buttonLabel: "Save Shader File",
            }

            dialog.showSaveDialog(options).then((f) => {
                console.log(f)
                let content = JSON.stringify(serialize(ShaderStore, this));

                fs.writeFile(f.filePath, content, (err) => {
                    if (err) {
                        console.log("an error has occurred: " + err.message);
                    } else {
                        console.log(f.filePath)
                        this.target.parent.loadShaders();
                    }      
                });
            }).catch(err => {
                console.error(err)
            });
        } else {
            let content = JSON.stringify(serialize(ShaderStore, this));

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

    get vertex() {
        return this.precision + this.vert;
    }

    get fragment() {
        return this.precision + this.frag;
    }

    onRemove() {
        this.target.removeShader(this);
    }
}

decorate(ShaderStore, {
    uuid:                observable,
    ref:                 observable,
    component:           observable,
    target:              observable,
    name:                observable,
    uniforms:            observable,
    precision:           observable,
    vert:                observable,
    frag:                observable,
    operatorUpdateGroup: observable,    
    inputs:              observable,
    outputs:             observable,
    node:                observable,
    vertex:              computed,
    fragment:            computed,
    onRemove:            action,
    init:                action,
    save:                action,
    load:                action,
});

createModelSchema(ShaderStore, {
    uuid:             identifier(),
    name:             primitive(),    
    precision:        primitive(),
    vert:             primitive(),
    frag:             primitive(),
    inputs:           list(primitive()),
    outputs:          list(primitive()), 
    uniforms:         list(object(UniformStore)),
}, c => {
    let p = c.parentContext ? c.parentContext.target : null;    
    return new ShaderStore(
        p, 
        c.json.precision,
        c.json.vert,
        c.json.frag,
        c.json.uniforms   
    );
});

export default ShaderStore;