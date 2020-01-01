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
  consoleText = 'camogen';
  suggestText = '';
  helpText = '';

  targets = [{
    id: uuidv1(),
    shaders: [
      new ShaderData("UV"),
      new ShaderData("Glyph"),
      new ShaderData("Glyph"),
    ],
  },
  // {
  //   id: uuidv1(),
  //   shaders: [
  //     new ShaderData("VideoGrabber"),
  //   ],
  // }
  ];

  addShader(target, type, index = null) {    
    let i = index ? index : target.shaders.length;
    target.shaders.splice(i, 0, new ShaderData(type));
  }

  removeShader(target, shader) {
    target.shaders = target.shaders.filter((item) => item !== shader);
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
        break;
    }
  }

  suggest(text) {
    const regex = new RegExp("^"+text+".*","g");
    const matched = NODES.types.filter((t) => 
      t.match(regex)
    );

    this.suggestText = matched.length && text ? matched[0] : '';
  }
}

decorate(ObservableStore, {  
  consoleText: observable,
  helpText: observable,
  suggestText: observable,

  targets: observable,

  addShader: action,
  removeShader: action,

  consoleChanged: action,
  suggest: action,
});

const observableStore = new ObservableStore();

export default observableStore;