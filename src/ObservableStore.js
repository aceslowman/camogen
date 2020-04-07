import { observable, action, decorate } from 'mobx';
import * as NODES from './components/nodes';
import Page from './models/Page';
import Target from './models/Target';
import Runner from './Runner';
import p5 from 'p5';
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

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const win = remote.getCurrentWindow();

const fs = window.require('fs');
const path = require('path');

class ObservableStore {
  p5_instance = null;

  targets = [];
  consoleText = 'camogen';
  suggestText = '';  

  activeTarget    = null;
  activeParameter = null;

  object_list = NODES.shader_types;

  show_splash = true;

  constructor() {  
    this.p5_instance = new p5(p => Runner(p, this));
  }

  consoleChanged() {
    switch (this.consoleText) {
      case 'clear':
        this.targets = [];
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
    const matched = NODES.shader_types.filter(t=>t.match(regex));

    this.suggestText = matched.length && text ? matched[0] : '';
  }

  addTarget() {
    this.targets.push(new Target(this));
  }

  removeTarget(target) {
    this.targets = this.targets.filter((item) => item !== target);
    if (this.activeTarget === target) {
      this.activeTarget = this.targets[0];      
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
    }).catch(err => alert(err));   
  }

  load() {
    dialog.showOpenDialog().then((f) => {
      let content = f.filePaths[0];
      fs.readFile(content, 'utf-8', (err, data) => {
        if(err)
          alert("in error has occurred: " + err.message);
          let obj = JSON.parse(data);

          let result = deserialize(
            ObservableStore, 
            {...obj, parent: this},
            (err, res) => {
              if (err) console.log(err);
              console.log(res);
            }
          );

          console.dir(result, { colors: true, depth: 10 })

          Object.assign(this, result);
      })
    }).catch(err => alert(err));
  }
}

decorate(ObservableStore, {  
  consoleText:     observable,  
  suggestText:     observable,  
  object_list:     observable,
  targets:         observable,
  activeTarget:    observable,
  activeParameter: observable,
  show_splash:     observable,
  consoleChanged:  action,
  suggest:         action,
  addTarget:       action,
  removeTarget:    action,
  save:            action, 
  load:            action, 
});

createModelSchema(ObservableStore, {
  targets:      list(object(Target)),
  activeTarget: object(Target),
  show_splash:  primitive(),
});

const observableStore = new ObservableStore();

// set defaults
observableStore.targets.push(
  new Target(observableStore).generateDefault()
);

export default observableStore;

