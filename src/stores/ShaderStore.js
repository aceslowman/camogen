import {
    createModelSchema,
    primitive,
    list,
    object,
    serialize,
    update,
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

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

// defaults
const d_prec = `
#ifdef GL_ES
precision highp float;
#endif 
`;

const d_vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * vec2(1., -1.);
    gl_Position = positionVec4;
}
`;

const d_frag = `
varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform vec2 resolution;
void main() {
    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
}
`;

/*
    This class is responsible for parsing an individual
     shader configuration file, making it consumable     
      by the main Store.
*/

class ShaderStore {
    uuid      = uuidv1();
    name      = "*NEW SHADER*";
    uniforms  = [];
    precision = "";
    vert      = "";
    frag      = "";
    ref       = null;
    target    = null;

    operatorUpdateGroup = [];

    constructor(
        target, 
        precision = d_prec, 
        vert = d_vert, 
        frag = d_frag, 
        uniforms = []
    ) {
        this.target = target; 
        this.precision = precision;
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms;        
    }

    extractUniforms(){ 
        const builtins = ["resolution"];
        
        let re = /(\buniform\b)\s([a-zA-Z_][a-zA-Z0-9]+)\s([a-zA-Z_][a-zA-Z0-9]+);\s+\/?\/?\s?({(.*?)})?/g
        let result = [...this.frag.matchAll(re)];
        
        // console.log(result)
        result.forEach((e) => {
            // ignore built-ins
            if(builtins.includes(e[3])) return;

            // ignore if uniform already exists
            // (preserves graphs)
            for(let i = 0; i < this.uniforms.length; i++){
                if(this.uniforms[i].name === e[3]){
                    return;
                }
            }

            let def;
            let opt = (e[4]) ? JSON.parse(e[4]) : {};

            switch(e[2]){
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

    init(){
        this.parameter_graphs = [];
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        );

        this.extractUniforms();

        for (let uniform of this.uniforms) {
            this.ref.setUniform(uniform.name, uniform.elements);
            
            for(let param of uniform.elements){
                if(param.graph)
                    this.parameter_graphs.push(param.graph)
            }
        }

        return this;
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
                        if(err) console.error(err)
                        // console.log('hit', item)
                        // why is this triggering twice
                        if(item) item.init();
                    },
                    {target: this.target}
                )
            })
        }).catch(err => {
            console.error(err);
        });
    }

    save() {
        let options = {
            title: 'testFile',
            defaultPath: app.getPath("appData"),
            buttonLabel: "Save Shader File",
        }

        dialog.showSaveDialog(options).then((f) => {            
            let content = JSON.stringify(serialize(ShaderStore, this));

            fs.writeFile(f.filePath, content, (err) => {
                if (err)
                    console.log("an error has occurred: " + err.message);
            });
        }).catch(err => {
            console.error(err)
        });
    }

    get vertex() {
        return this.precision + this.vert;
    }
    get fragment() {
        return this.precision + this.frag;
    }
}

decorate(ShaderStore, {
    // uuid:             observable,
    ref:              observable,
    target:           observable,
    name:             observable,
    uniforms:         observable,
    precision:        observable,
    vert:             observable,
    frag:             observable,
    operatorUpdateGroup: observable,
    vertex:           computed,
    fragment:         computed,
    init:             action,
    save:             action,
    load:             action,
});

createModelSchema(ShaderStore, {
    // uuid:             identifier(),
    name:             primitive(),    
    precision:        primitive(),
    vert:             primitive(),
    frag:             primitive(),
    uniforms:         list(object(UniformStore)),
}, c => {
    let p = c.parentContext ? c.parentContext.target : c.args.target;
    return new ShaderStore(
        p, 
        c.json.precision,
        c.json.vert,
        c.json.frag,
        c.json.uniforms   
    ).init();
});

export default ShaderStore;