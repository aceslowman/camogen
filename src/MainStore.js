import { observable, action, decorate } from 'mobx';
import * as NODES from './stores';
import Node from './stores/NodeStore';
import Target from './stores/TargetStore';
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
import ShaderStore from './stores/ShaderStore';
import { create, persist } from 'mobx-persist';
import Graph from './stores/GraphStore';

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;

const fs = window.require('fs');

class MainStore {
  p5_instance = null;

  shaderGraphs = [];
  targets = []; // phasing out
  consoleText = 'camogen';
  suggestText = '';  

  activeTarget    = null;
  
  object_list = NODES.shader_types;
  shader_list = {};

  show_splash = false;

  constructor() {  
    this.p5_instance = new p5(p => Runner(p, this));    

    this.loadShaders().then(()=>{
      console.log('shaders loaded successfully!', this.shader_list);
      const t = new Target(this);
      const g = new Graph(this)

      const uv = deserialize(ShaderStore, this.shader_list["UV"], ()=>{}, {target: t}).init();
      const noise = deserialize(ShaderStore, this.shader_list["Noise"], ()=>{}, {target: t}).init()
      const glyph = deserialize(ShaderStore, this.shader_list["Glyph"], ()=>{}, {target: t}).init()
      const add = deserialize(ShaderStore, this.shader_list["Add"], () => {}, {target: t}).init()
      const hsv = deserialize(ShaderStore, this.shader_list["ToHSV"], () => {}, {target: t}).init()
      // const wavy = deserialize(ShaderStore, this.shader_list["Wavy"], () => {}, {target: t}).init()
      
      t.shaders = [
        uv,
        glyph,
        add,
        hsv,
        // wavy,
      ];

      const uv_g = new Node(uv);
      const glyph_g = new Node(glyph);
      const add_g = new Node(add);
      const hsv_g = new Node(hsv);
      // const wavy_g = new Node(wavy);

      g.addNodeToEnd(uv_g);
      g.addNodeToEnd(glyph_g);
      g.addNodeToEnd(add_g);
      g.addNodeToEnd(hsv_g);
      // g.addNodeToEnd(wavy_g);

      this.targets.push(t); // phasing out
      this.shaderGraphs.push(g)
      // localStorage.clear()
      // hydrate("targets",this,[t]).then(r => console.log("rehydrated",r))
    }); 
  }

  async loadShaders() {
    let path = `${app.getPath("userData")}/shaders`;

    try {
      await fs.promises.access(path) // check if path exists

      const files = await fs.promises.readdir(path);

      await Promise.all(files.map(async (type) => {
        const data = JSON.parse(await fs.promises.readFile(path + '/' + type));
        data.name = type.split('.')[0];
        this.shader_list = {
          ...this.shader_list,
          [data.name]: data
        }
      }))
    } catch (err) {
      fs.promises.mkdir(path).catch(console.error)

      console.log('new directory created for shaders', path);
      await this.loadShaders();
    }  
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
    const t = new Target(this);

    t.shaders = [
      // new UV(t).init(),
    ];

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
          console.error("an error has occurred: "+err.message);
      });
    }).catch(err => console.error(err));
  }

  load() {
    dialog.showOpenDialog().then((f) => {
      let content = f.filePaths[0];
      fs.readFile(content, 'utf-8', (err, data) => {
        if(err)
          console.error("an error has occurred: " + err.message);          

          update(
            MainStore,
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
}

decorate(MainStore, {  
  consoleText:     observable,  
  suggestText:     observable,  
  object_list:     observable,
  targets:         [persist('list'),observable],
  shaderGraphs:    [persist('list'), observable],
  activeTarget:    observable,
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

const mainStore = new MainStore;
export default mainStore;

