import { observable, action } from 'mobx';
import {
    serialize,
    update,
} from "serializr";

import Target from './TargetStore';
import Graph from './GraphStore';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

export default class SceneStore {
    @observable parent = null;

    @observable shaderGraphs = [];
    @observable targets = [];

    @observable activeTarget = null;
    @observable activeGraph = null;
    @observable currentlyEditing = null;
    
    constructor(parent) {
        this.parent = parent;        

        const g = new Graph(this);

        const uv = this.parent.getShader("UV", g);
        const glyph = this.parent.getShader("Glyph", g);
        const add = this.parent.getShader("Add", g);
        const hsv = this.parent.getShader("ToHSV", g);

        // const img   = this.getShaderInput("ImageInput",g);
        // const webcam = this.getShaderInput("WebcamInput", g);

        g.root.setData(uv);
        // g.root.setData(img);
        // g.root.setData(webcam);
        g.root.setData(glyph);
        g.root.setData(add)
        g.root.setData(hsv);

        g.afterUpdate = (queue) => this.assignTargets(queue);

        g.root.select(true);
        g.update();

        this.shaderGraphs.push(g);
        this.activeGraph = g;
        // localStorage.clear()

        // const initial_state = {
        //     shaderGraphs: [g],
        //     activeGraph: g
        // }
    }

    @action addTarget(target = new Target(this.parent)) {
        this.targets.push(target);
        return target;
    }

    @action assignTargets(queue) {
        queue.forEach(node => {
            if (node.data) {
                if (this.targets.length && this.targets[node.branch_index]) {
                    node.data.target = this.targets[node.branch_index];
                } else {
                    node.data.target = this.addTarget();
                }

                node.data.target.assignShader(node.data);

                node.data.init();
            }
        });
    }

    @action save() {
        let options = {
            title: 'testFile',
            defaultPath: app.getPath("desktop"), 
            buttonLabel: "Save Camo File",
            filters: [
                {name: 'Camo Save Files', extensions: ['camo']},
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
        dialog.showOpenDialog().then((f) => {
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

    @action edit(node) {
        this.currentlyEditing = node.data;
    }
};