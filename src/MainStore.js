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
  targets      = []; 

  consoleText = 'camogen';
  suggestText = '';  

  activeTarget    = null;
  activeGraph     = null;
  
  shader_list = {};

  show_splash = false;

  constructor() {  
    this.p5_instance = new p5(p => Runner(p, this));    

    this.loadShaders().then(()=>{
      console.log('shaders loaded successfully!', this.shader_list);
      const g = new Graph(this);

      const uv    = this.getShader("UV");
      const glyph = this.getShader("Glyph");
      const add   = this.getShader("Add");
      const hsv   = this.getShader("ToHSV");

      g.addNodeToEnd(new Node(g,uv));
      g.addNodeToEnd(new Node(g,glyph));
      g.addNodeToEnd(new Node(g,add));
      g.addNodeToEnd(new Node(g,hsv));

      g.root.select();
      
      g.afterUpdate = (queue) => this.assignTargets(queue);
      g.update();
          
      this.shaderGraphs.push(g)
      this.activeGraph = g;
      // localStorage.clear()
      // hydrate("targets",this,[t]).then(r => console.log("rehydrated",r))
    }); 
  }

  assignTargets(queue) {
    queue.forEach(node => {
      if(node.data) {      
        // node.data.target = this.targets[node.branch_index]
        //   ? this.targets[node.branch_index]
        //   : this.addTarget();

        if (this.targets[node.branch_index]) {
          node.data.target = this.targets[node.branch_index];
        } else {
          node.data.target = this.addTarget();
          // node.data.target.addShader(node.data)
        }
          
        // node.data.target.shaders.push(node.data);
        node.data.target.assignShader(node.data);
        
        node.data.init();
      }
    });
  }

  addTarget(target = new Target(this)) {
    this.targets.push(target);
    return target;
  }

  getShader(name) {
    if(Object.keys(this.shader_list).includes(name)){
      return deserialize(ShaderStore, this.shader_list[name])
    } else {
      console.error(`couldn't find shader named '${name}'`);
      return null;
    } 
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

  addShaderGraph(t = new Graph(this)) {
    this.shaderGraphs.push(t);
    return this.shaderGraphs.length;
  }

  removeShaderGraph(graph) {
    this.shaderGraphs = this.shaderGraphs.filter((item) => item !== graph);
    if (this.activeGraph === graph) {
      this.activeGraph = this.shaderGraphs[0];
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
  shader_list:     observable,
  targets:         [persist('list'),observable], // phasing out
  shaderGraphs:    [persist('list'), observable],
  activeGraph:     observable,
  show_splash:     observable,
  consoleChanged:  action,
  suggest:         action,
  addGraph:        action,
  removeGraph:     action,
  save:            action, 
  load:            action, 
});

createModelSchema(MainStore, {
  targets:      list(object(Graph)),
  activeGraph:  reference(Graph),
  show_splash:  primitive(),
});

const mainStore = new MainStore;
export default mainStore;

