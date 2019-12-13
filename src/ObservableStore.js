import { observable, computed, action, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';

import * as NODES from './components/nodes';

class ObservableStore {
  nodes = {
    byId: {
      0: {
        type: 'UVGenerator',
        next: 1,
        uniforms: {
          bSquare: false,
        }
      },
      1: {
        type: 'GlyphShader',
        next: 2,
        uniforms: {
          seed: Math.floor(Math.random() * 1000),
          noiseScale: 0.1,
          noiseStep: 8,
          dimensions: [20,20]
        },       
      },
      2: {
        type: 'GlyphShader',
        next: 3,
        uniforms: {
          seed: Math.floor(Math.random() * 1000),
          noiseScale: 2,
          noiseStep: 8,
          dimensions: [6,6]
        },       
      },
      3: {
        type: 'RenderTarget',
        next: null,
      },
    },
    allIds: [0,1,2,3]
  };

  canvasWidth  = 200;
  canvasHeight = 200;

  generateFlag = false;
  snapshotFlag = false;

  sketchReady = false;

  consoleText = 'camogen';
  consoleStyle = {color:'black'};
  helpText = '';
  suggestText = '';

  addNode(type) {
    let n = { type: type };

    switch(type) {
      case 'GlyphShader':
        n = {
          ...n,
          type: 'GlyphShader',
          next: null,
          uniforms: {
            seed: Math.floor(Math.random() * 1000),
            noiseScale: 0.1,
            noiseStep: 8,
            dimensions: [20,20]
          },
        };        
        break;
      case 'DebugShader':
        n = {
          ...n,
        };
        break;
      case 'UVGenerator':
        n = {
          ...n,
          uniforms: {
            bSquare: false,
          }
        };
        break;
      default:
        break;
    }

    let id = uuidv1();
    this.nodes.allIds.push(id);
    this.nodes.byId[id] = n;

    console.group("added new node");
    console.log("byId",this.nodes.byId);
    console.log("allIds",this.nodes.allIds);
    console.groupEnd();
  }

  removeNode(id) {
    delete this.nodes.byId[id];

    let index = this.nodes.allIds.indexOf(id);
    if(index > -1) this.nodes.allIds.splice(index, 1);

    console.log("removed node");
  }

  clearAllNodes() {
    this.nodes.byId = {};
    this.nodes.allIds = [];

    console.log("removed all nodes");    
  }

  resize() {
    
  }

  fitScreen() {
    //
  }

  randomize(id) {
    //
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

  get nodeCount() {
    return this.nodes.allIds.length;
  }
}

decorate(ObservableStore, {
  nodes: observable,
  canvasWidth: observable,
  canvasHeight: observable,
  generateFlag: observable,
  snapshotFlag: observable,
  sketchReady: observable,
  consoleText: observable,
  helpText: observable,
  suggestText: observable,
  addNode: action,
  removeNode: action,
  resize: action,
  fitScreen: action,
  randomize: action,
  consoleChanged: action,
  suggest: action,
  dimensions: computed,
  aspect: computed,
  nodeCount: computed
});

const observableStore = new ObservableStore();

export default observableStore;