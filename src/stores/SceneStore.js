import { observable, action } from 'mobx';
import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    identifier,
    serialize,
    deserialize,
    getDefaultModelSchema,
    serializable,
    update
} from "serializr"
import uuidv1 from 'uuid/v1';
import Target from './TargetStore';
import path from 'path';
import ShaderGraphStore from './ShaderGraphStore';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

export default class SceneStore {
    @serializable(identifier())
    @observable uuid = uuidv1();
    
    @serializable(list(object(ShaderGraphStore.schema)))
    @observable shaderGraphs = [];

    @observable activeShaderGraph = null;

    @observable parent = null;
    
    @observable targets = [];
    
    constructor(parent) {
        this.parent = parent;        
        const g = new ShaderGraphStore(this);

        // DEFAULTS (FOR NOW)
        // console.log(this.parent.shader_list)
        g.addNodeByName("UV");
        g.addNodeByName("Glyph");
        // g.addNodeByName("Add");
        // g.addNodeByName("ToHSV");

        this.shaderGraphs.push(g);
        this.activeShaderGraph = g;        
    }

    @action addTarget(target = new Target(this.parent)) {
        this.targets.push(target);
        return target;
    }

    @action clear() {
        if(window.confirm('this will remove all effects, continue?')){
            for (let graph of this.shaderGraphs) {
                graph.clear();
            }

            for(let target of this.targets) {
                target.clear();
            }
   
            this.activeShaderGraph = this.shaderGraphs[0];
        }
    }

    @action save() {
        let options = {
            title: 'Save Scene File',
            defaultPath: path.join(app.getPath("desktop"),`untitled.scene.camo`), 
            buttonLabel: "Save",
            filters: [
                {name: 'Camo Scene Files', extensions: ['scene.camo']},
            ]
        }

        dialog.showSaveDialog(options).then((f)=>{
            let content = JSON.stringify(serialize(this));

            fs.writeFile(f.filePath, content, (err)=>{
                if(err) {         
                    console.error("an error has occurred: "+err.message);
                } else {
                    console.log('scene has been saved at file:/'+f.filePath)
                }                
            });
            
        }).catch(err => console.error(err));
    }

    @action load() {
        let options = {
            title: 'Load Scene File',
            defaultPath: app.getPath("desktop"),
            buttonLabel: "Load",
            filters: [{
                name: 'Camo Scene Files',
                extensions: ['scene.camo']
            }, ]
        }

        dialog.showOpenDialog(options).then((f) => {
        let content = f.filePaths[0];
        fs.readFile(content, 'utf-8', (err, data) => {
            if(err)
            console.error("an error has occurred: " + err.message);          

            update(
                SceneStore,
                this,
                JSON.parse(data),
                (err, item) => {
                    if (err) console.error(err)              

                    // item.init();
                },
                {target: this}
            )
        })
        }).catch(err => {/*alert(err)*/});
    }
};