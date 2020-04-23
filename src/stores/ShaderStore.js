import {
    createModelSchema,
    setDefaultModelSchema,
    primitive,
    list,
    object,
    identifier,
    serialize,
    deserialize,
    update,
    reference,
} from "serializr";
import {
    observable,
    computed,
    decorate,
    action
} from 'mobx';

import uuidv1 from 'uuid/v1';
import UniformStore from './UniformStore';
import ParameterGraph from './ParameterGraphStore';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

/*
    This class is responsible for parsing an individual
     shader configuration file, making it consumable     
      by the main Store.
*/

class ShaderStore {
    uuid      = uuidv1();
    name      = "";
    uniforms  = [];
    precision = "";
    vert      = "";
    frag      = "";
    ref       = null;
    target    = null;

    parameter_graphs = [];

    constructor(target, precision, vert, frag, uniforms) {
        this.target = target; 
        this.precision = precision;
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms
    }

    init(){
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        );

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
                        console.log('hit', item)

                        item.init();
                    },
                    {target: this.target}
                )
            })
        }).catch(err => {
            // alert(err);
        });
    }

    save() {
        let options = {
            title: 'testFile',
            defaultPath: app.getPath("desktop"),
            buttonLabel: "Save Shader File",
        }

        dialog.showSaveDialog(options).then((f) => {            
            let content = JSON.stringify(serialize(ShaderStore, this));

            fs.writeFile(f.filePath, content, (err) => {
                if (err)
                    console.log("an error has occurred: " + err.message);
            });
        }).catch(err => {
            // console.error(err)
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
    uuid:             observable,
    ref:              observable,
    target:           observable,
    name:             observable,
    parameter_graphs: observable,
    uniforms:         observable,
    precision:        observable,
    vert:             observable,
    frag:             observable,
    vertex:           computed,
    fragment:         computed,
    save:             action,
    load:             action,
});

createModelSchema(ShaderStore, {
    uuid:             identifier(),
    name:             primitive(),    
    precision:        primitive(),
    vert:             primitive(),
    frag:             primitive(),
    parameter_graphs: list(reference(ParameterGraph)),
    uniforms:         list(object(UniformStore)),
}, c => {
    let p = c.parentContext ? c.parentContext.target : c.args.target;
    console.log('shader store factory',c)
    let json = c.json;
    let s = new ShaderStore(
        p, 
        json.precision,
        json.vert,
        json.frag,
        json.uniforms   
    );
    s.init()

    return s;
});

export default ShaderStore;