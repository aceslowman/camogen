import { observable, action } from 'mobx';
import {
    createModelSchema,
    list,
    object,
    serialize,
    reference,
    update
} from "serializr";

import Target from './TargetStore';
import ShaderGraph from './ShaderGraphStore';
import path from 'path';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

export default class SceneStore {
    @observable parent = null;

    @observable shaderGraphs = [];
    @observable targets = [];
    
    constructor(parent) {
        this.parent = parent;        

        const g = new ShaderGraph(this);

        // DEFAULTS (FOR NOW)
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
            let content = JSON.stringify(serialize(SceneStore, this));

            fs.writeFile(f.filePath, content, (err)=>{
                if(err)          
                console.error("an error has occurred: "+err.message);
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

createModelSchema(SceneStore, {
    shaderShaderGraphs: list(object(ShaderGraph)),
    targets: list(object(Target)),
}, c => {
    let p = c.parentContext ? c.parentContext.target : null;
    return new SceneStore(p);
});