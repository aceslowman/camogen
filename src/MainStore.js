import { observable, action } from 'mobx';
// import * as NODES from './stores';
import Target from './stores/TargetStore';
import Runner from './Runner';
import p5 from 'p5';
import {
  createModelSchema,
  // primitive,
  list,
  object,
  serialize,
  deserialize,
  update,
  reference,
} from "serializr";
import ShaderStore from './stores/ShaderStore';
import ConsoleStore from './stores/ConsoleStore';
import { create } from 'mobx-persist';
import Graph from './stores/GraphStore';
// import ImageInput from './stores/inputs/ImageInput';
import WebcamInput from './stores/inputs/WebcamInput';
const path = require('path');

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
  @observable p5_instance = null;

  @observable shaderGraphs = [];
  @observable targets      = []; 

  @observable activeTarget    = null;
  @observable activeGraph     = null;

  @observable currentlyEditing = null;
  
  @observable shader_list = {};

  @observable console = new ConsoleStore();

  constructor() {  
    this.p5_instance = new p5(p => Runner(p, this));    

    this.loadShaders().then(()=>{
      console.log('shaders loaded successfully!', this.shader_list);
      const g = new Graph(this);

      const uv    = this.getShader("UV",g);
      const glyph = this.getShader("Glyph",g);
      const add   = this.getShader("Add",g);
      const hsv   = this.getShader("ToHSV",g);

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
          
      // this.shaderGraphs.push(g)
      // this.activeGraph = g;
      localStorage.clear()

      const initial_state = {
        shaderGraphs: [g],
        activeGraph: g
      }

      hydrate("main",this, initial_state).then(r => console.log("hydrated",r))
    }); 
  }

  @action resetAndClear() {
    if(window.confirm('this will clear all shaders, continue?')){
      this.targets.forEach(e => {
        e.clear();
      });
      this.activeGraph.clear();
    }
  }

  @action assignTargets(queue) {
    queue.forEach(node => {
      if(node.data) {      
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

  @action addTarget(target = new Target(this)) {
    this.targets.push(target);
    return target;
  }

  @action getShader(name = null) {
    if(name === null) {
      console.log(this.shader_list)
    } else if(Object.keys(this.shader_list).includes(name)){
      return deserialize(ShaderStore, this.shader_list[name])
    } else {
      console.error(`couldn't find shader named '${name}'`);
      return null;
    } 
  }

  @action getShaderInput(name = null, graph = null) {
    // temporary
    // return new ImageInput();    
    return new WebcamInput();
  }

  @action async loadShaders() {
    let default_shaders_path = app.isPackaged 
      ? path.join(app.getAppPath(), '../shaders')
      : path.join(app.getAppPath(), 'shaders');
    let user_shaders_path = path.join(app.getPath("userData"),'shaders');

    try {
      await fs.promises.access(user_shaders_path) // check if path exists

      let files = await fs.promises.readdir(user_shaders_path);

      await Promise.all(files.map(async (type) => {
        const data = JSON.parse(await fs.promises.readFile(user_shaders_path + '/' + type));
        data.name = type.split('.')[0];
        this.shader_list = {
          ...this.shader_list,
          [data.name]: data
        }
      }))
    } catch (err) { // if user data shaders doesn't exist
      fs.promises.mkdir(user_shaders_path).catch(console.error);
      
      console.log('new directory created for shaders', user_shaders_path);
      console.log('copy default shaders from', default_shaders_path);

      let default_files = await fs.promises.readdir(default_shaders_path).catch(console.error);

      // copy default to user
      default_files.forEach((filename)=>{
        console.log(filename)
        fs.promises.copyFile(path.join(default_shaders_path, filename), path.join(user_shaders_path,filename))
      });
      
      await this.loadShaders();
    }  
  }

  @action addShaderGraph(t = new Graph(this)) {
    this.shaderGraphs.push(t);
    return this.shaderGraphs.length;
  }

  @action removeShaderGraph(graph) {
    this.shaderGraphs = this.shaderGraphs.filter((item) => item !== graph);
    if (this.activeGraph === graph) {
      this.activeGraph = this.shaderGraphs[0];
    }
  }

  @action edit(node) {
    this.currentlyEditing = node.data;
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
      let content = JSON.stringify(serialize(MainStore, this));

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

  @action breakout() {
    let new_window = window.open('/output_window.html');
    new_window.gl = this.p5_instance.canvas.getContext('2d'); 
    // new_window.dimensions = []
  }

  @action async snapshot() {
    var dataURL = this.p5_instance.canvas.toDataURL("image/png");

    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    var content = new Buffer(data, 'base64');
    
    let path = `${app.getPath("userData")}/snapshots`;

    const show_dialog = true;

    if (show_dialog) {
      let options = {
        title: this.name + '.shader',
        defaultPath: path,
        buttonLabel: "Save Shader File",
      }

      dialog.showSaveDialog(options).then((f) => {      
        fs.writeFile(f.filePath, content, "base64", (err) => {
          if (err) {
            console.log("an error has occurred: " + err.message);
          } else {
            console.log("snapshot saved",f.filePath);            
          }
        });
      }).catch(err => {
        console.error(err)
      });
    } else {
      let content = JSON.stringify(serialize(ShaderStore, this));

      let file = this.name + '.shader';

      fs.writeFile(`path/${file}`, content, "base64", (err, data) => {
        if (err) {
          console.log("an error has occurred: " + err.message);
        } else {
          console.log('saved!', data);
        }
      });
    }
  }
}

createModelSchema(MainStore, {
  shaderGraphs: list(object(Graph)),
  targets:      list(object(Target)),
  activeGraph:  reference(Graph),
});

const mainStore = new MainStore();
export default mainStore;

