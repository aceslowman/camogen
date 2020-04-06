import { observable, action, decorate } from 'mobx';
import * as NODES from './components/nodes';
import Page from './models/Page';
import Target from './models/Target';
import {
  createModelSchema,
  primitive,
  reference,
  list,
  object,
  identifier,
  serialize,
  deserialize
} from "serializr";

import p5 from 'p5';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const win = remote.getCurrentWindow();

const fs = window.require('fs');
const path = require('path');

const sketch = (p, store, props) => {

  p.setup = () => {
    p.frameRate(1);
    p.createCanvas(
      window.innerWidth,
      window.innerHeight
      // props.work_area.current.offsetWidth,
      // props.work_area.current.offsetHeight
    );

    p.background(255, 0, 255);
  }

  p.draw = () => {
    if (store.activeTarget) {
      for (let target_data of store.targets) {
        // console.log(target_data);
        let target = target_data.ref;

        for (let shader_data of target_data.shaders) {
          let shader = shader_data.ref;

          /* 
              Loop through all active parameter graphs to recompute 
              values in sync with the frame rate
          */
          for (let parameter_graph of shader_data.parameter_graphs) {
            parameter_graph.update();
          }

          for (let uniform_data of shader_data.uniforms) {
            if (uniform_data.elements) {

              // there should be a more elegant way of doing this
              let elements = [];

              for (let element of uniform_data.elements) {
                elements.push(element.value);
              }

              shader.setUniform(uniform_data.name, elements);
            } else {
              shader.setUniform(uniform_data.name, uniform_data.value);
            }
          }

          shader.setUniform('tex0', target);
          shader.setUniform('resolution', [target.width, target.height]);

          target.shader(shader);

          target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        }
      }

      p.image(store.activeTarget.ref, 0, 0, p.width, p.height);
    } else {
      p.background(0);
    }
  }

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    store = props.store;
  };
}


class ObservableStore {
  p5_instance = null;

  consoleText = 'camogen';
  suggestText = '';
  helpText = '';

  page = new Page();

  targets = [];

  activeTarget = this.targets[0];
  activeParameter = "";

  object_list = NODES.shader_types;

  canvas_width = 0;
  canvas_height = 0;

  show_splash = true;

  constructor() {  
    this.p5_instance = new p5((p) => sketch(p, this));
    this.targets.push(new Target(this));

    
  }

  consoleChanged() {
    switch (this.consoleText) {
      case 'clear':
        // this.clearAllNodes();
        this.consoleText = "";
        this.consoleStyle = {color:'black'};
        break;
      default:        
        this.activeTarget.addShader(this.consoleText);
        this.consoleText = "";
        this.suggestText = "";
        break;
    }
  }

  suggest(text) {
    const regex = new RegExp("^"+text+".*","g");
    const matched = NODES.shader_types.filter((t) => 
      t.match(regex)
    );

    this.suggestText = matched.length && text ? matched[0] : '';
  }

  addTarget() {
    this.targets.push(new Target(this));
  }

  removeTarget(target) {
    // make sure that all shaders are disposed of
    this.targets = this.targets.filter((item) => item !== target);
    if (this.activeTarget === target) {
      this.activeTarget = null;      
    }else{
      // change active target to next target
    }
  }

  save() {
    let options = {
      title: 'testFile',
      defaultPath: app.getPath("desktop"), 
      buttonLabel: "Save Camo File",
      filters: [
        {name: 'Camo Save Files', extensions: ['camo']},
      ]
    }

    dialog.showSaveDialog(options).then((f)=>{
      let content = JSON.stringify(serialize(this));

      fs.writeFile(f.filePath, content, (err)=>{
        if(err)          
          alert("in error has occurred: "+err.message);
      });
    }).catch(err => {
      alert(err);
    });    
  }

  load() {
    console.log("hit");
    dialog.showOpenDialog().then((f) => {
      let content = f.filePaths[0];
      fs.readFile(content, 'utf-8', (err, data) => {
        if(err)
          alert("in error has occurred: " + err.message);

          let result = deserialize(ObservableStore, JSON.parse(data));

          console.dir(result, { colors: true, depth: 10 })

          // i expect this to be a problem
          Object.assign(this, result);
      })
    }).catch(err => {
      alert(err);
    });
  }
}

decorate(ObservableStore, {  
  consoleText:     observable,
  helpText:        observable,
  suggestText:     observable,
  activeParameter: observable,
  object_list:     observable,
  targets:         observable,
  activeTarget:    observable,
  canvas_width:    observable,
  canvas_height:   observable,
  page:            observable,
  show_splash:     observable,
  consoleChanged:  action,
  suggest:         action,
  addTarget:       action,
  removeTarget:    action,
  save:            action, 
  load:            action, 
});

createModelSchema(ObservableStore, {
  targets: list(object(Target)),
  activeTarget: object(Target),
  canvas_width: primitive(),
  canvas_height: primitive(),
});

const observableStore = new ObservableStore();


export default observableStore;

