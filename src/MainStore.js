import { observable, action, decorate } from 'mobx';
import * as NODES from './stores';
import Target from './stores/TargetStore';
import Glyph from './stores/shaders/Glyph';
import UV from './stores/shaders/UV';
import Runner from './Runner';
import p5 from 'p5';
import {
  createModelSchema,
  primitive,
  list,
  object,
  serialize,
  deserialize,
  update,
  reference,
} from "serializr";

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const win = remote.getCurrentWindow();

const fs = window.require('fs');
const path = require('path');

class MainStore {
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
    // this.targets.push(new Target(this));
    const t = new Target(this);

    t.shaders = [
      new UV(t).init(),
      new Glyph(t).init(),
    ];

    // set defaults
    this.targets.push(t);
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
      let content = JSON.stringify(serialize(MainStore, this));

      fs.writeFile(f.filePath, content, (err)=>{
        if(err)          
          alert("in error has occurred: "+err.message);
      });
    }).catch(err => console.error(err));
  }

  load() {
    dialog.showOpenDialog().then((f) => {
      let content = f.filePaths[0];
      fs.readFile(content, 'utf-8', (err, data) => {
        if(err)
          alert("in error has occurred: " + err.message);          

          update(
            MainStore,
            this,
            JSON.parse(data),
            (err, item) => {
              if (err) console.error(err)
              console.log('hit', item)

              // item.init();
            },
            {target: this}
          )
      })
    }).catch(err => alert(err));
  }
}

decorate(MainStore, {  
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

createModelSchema(MainStore, {
  targets:      list(object(Target)),
  activeTarget: reference(Target),
  show_splash:  primitive(),
});

const mainStore = new MainStore();
const t = new Target(mainStore);

t.shaders = [
  new UV(t).init(),
  new Glyph(t).init(),
];

// set defaults
mainStore.targets.push(t);

export default mainStore;

