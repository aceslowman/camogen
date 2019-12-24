import { observable, computed, action, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';

import * as NODES from './components/nodes';

class ShaderData {
  id        = uuidv1();
  name      = "";
  uniforms  = [];
  precision = "";
  vert      = "";
  frag      = "";

  constructor(type) {
    this.load(NODES.modules[type]);
  }

  load = (obj) =>  {
    this.name = obj.name;

    // convert to parameter
    for(let u_id in obj.uniforms) {      
      this.uniforms.push(new ParameterData({
        name: u_id, 
        value: obj.uniforms[u_id]
      }));
    }

    this.precision = obj.precision;
    this.vert = obj.vert;
    this.frag = obj.frag;
  }

  get vertex(){
    return this.precision + this.vert;  
  } 
  get fragment(){
    return this.precision + this.frag;  
  } 
}

decorate(ShaderData, {
  id: observable,
  target_id: observable,
  name: observable,
  uniforms: observable,
  precision: observable,
  vert: observable,
  frag: observable,
  vertex: computed,
  fragment: computed,
});

class ParameterData {
  id = uuidv1();
  name = "";
  value = null;

  constructor (obj) {
    this.name = obj.name;
    this.value = obj.value;
  }
}

decorate(ParameterData, {
  id: observable,
  name: observable,
  value: observable,
});

class ObservableStore {

  // in progress, removing normalization
  t_id = uuidv1();
  targets = [{
    id: this.t_id,
    shaders: [
      new ShaderData("UV"),
      new ShaderData("Glyph"),
      new ShaderData("Glyph"),
    ],
  }];

  canvasWidth  = 200;
  canvasHeight = 200;

  sketchReady = false;

  consoleText = 'camogen';
  consoleStyle = {color:'black'};
  suggestText = '';
  helpText = '';

  // addTarget() {    
  //   let id = uuidv1();
  //   this.targets.allIds.push(id);
  //   this.targets.byId[id] = {
  //     id: id,
  //     shaders: []
  //   };

  //   // console.group("added new target");
  //   // console.log("byId",this.targets.byId);
  //   // console.log("allIds",this.targets.allIds);
  //   // console.groupEnd();

  //   return id;
  // }

  // removeTarget() {}

  // addParameter(data, shader_id) {
  //   let id = uuidv1();

  //   this.parameters.allIds.push(id);
  //   this.parameters.byId[id] = {
  //     ...data,
  //     id: id
  //   };

  //   // console.group("added new parameter");
  //   // console.log("byId",this.parameters.byId);
  //   // console.log("allIds",this.parameters.allIds);
  //   // console.groupEnd();

  //   return id;
  // }

  // addShader(type, target_id) {
  //   let shader = NODES.modules[type];

  //   let id = uuidv1();
    
  //   let uniform_ids = [];

  //   // parse uniforms
  //   for(let uniform in shader.uniforms) {      
  //     uniform_ids.push(this.addParameter({
  //       name: uniform,
  //       value: shader.uniforms[uniform],
  //     }, id));
  //   }

  //   this.shaders.allIds.push(id);
  //   this.shaders.byId[id] = {
  //     ...shader,
  //     id: id,
  //     uniforms: uniform_ids,
  //     target_id: target_id,
  //   };

  //   this.targets.byId[target_id].shaders.push(id);

  //   // console.group("added new shader");
  //   // console.log("byId",this.shaders.byId);
  //   // console.log("allIds",this.shaders.allIds);
  //   // console.groupEnd();

  //   return id;
  // }

  // removeShader(id) {
  //   let shader = this.shaders.byId[id];
  //   console.log(shader);
  //   let target = this.targets.byId[shader.target_id];

  //   // remove shader node from id list
  //   let s_index = this.shaders.allIds.indexOf(id);
  //   if(s_index > -1) this.shaders.allIds.splice(s_index, 1);

  //   // remove shader node from target shader list
  //   let t_index = target.shaders.indexOf(id);
  //   if(t_index > -1) target.shaders.splice(t_index, 1);

  //   delete this.shaders.byId[id];

  //   // console.log("removed shader", this.shaders.byId);
  //   // console.log(target.shaders);
  // }

  initialize() {
    // let target_id = this.addTarget();

    // this.addShader('UV', target_id);
    // this.addShader('Glyph', target_id);
    // this.addShader('Glyph', target_id);
  }

  clearAllNodes() {
    this.shaders.byId = {};
    this.shaders.allIds = [];

    console.log("removed all shaders");    
  }

  consoleChanged() {
    switch (this.consoleText) {
      case 'clear':
        this.clearAllNodes();
        this.consoleText = "";
        this.consoleStyle = {color:'black'};
        break;
      default:
        this.addNode(this.consoleText);
        this.consoleText = "";
        this.suggestText = "";
        // this.consoleStyle = {color:'green'};
        break;
    }
  }

  suggest(text) {
    const regex = new RegExp("^"+text+".*","g");
    const matched = NODES.types.filter((t) => 
      t.match(regex)
    );

    this.suggestText = matched.length && text ? matched[0] : '';
    // console.log('matched',matched);
  }

  get dimensions()  {
    return [this.canvasWidth,this.canvasHeight];
  }

  get aspect() {
    return this.canvasWidth / this.canvasHeight;
  }

  getShaderById(id) {
    return this.shaders.byId[id];
  }

  get shaderCount() {
    return this.shaders.allIds.length;
  }

  get targetCount() {    
    return  this.targets.allIds.length;
  }
}

decorate(ObservableStore, {
  targets: observable,
  parameters: observable,
  canvasWidth: observable,
  canvasHeight: observable,
  sketchReady: observable,
  consoleText: observable,
  helpText: observable,
  suggestText: observable,
  initialize: action,
  addParameter: action,
  addShader: action,
  removeShader: action,
  addTarget: action,
  removeTarget: action,
  resize: action,
  fitScreen: action,
  randomize: action,
  consoleChanged: action,
  suggest: action,
  dimensions: computed,
  aspect: computed,
  shaderCount: computed,
  targetCount: computed,
  getShaderById: action,
});

const observableStore = new ObservableStore();

export default observableStore;