import react from 'react';
import { observable, computed, action, decorate, autorun } from 'mobx';
import uuidv1 from 'uuid/v1';

import GlyphShader from './components/shaders/GlyphShader';
import DebugShader from './components/shaders/DebugShader';

class ObservableStore {
  nodes = {
    byId: {
      0: {
        type: 'GlyphShader',
        seed: Math.floor(Math.random() * 1000),
        noiseScale: 0.1,
        noiseStep: 8,
        dimX: 20,
        dimY: 20
      },
      1: {
        type: 'GlyphShader',
        seed: Math.floor(Math.random() * 1000),
        noiseScale: 2,
        noiseStep: 8,
        dimX: 6,
        dimY: 6
      }
    },
    allIds: [0,1]
  };

  canvasWidth  = 200;
  canvasHeight = 200;

  generateFlag = false;
  snapshotFlag = false;

  constructor() {
  	autorun(() => console.log(this.report));
  }

  // testing actions
  addNode(type) {
    let n;

    switch(type) {
      case 'glyph':
        n = {
          type: 'GlyphShader',
          seed: Math.floor(Math.random() * 1000),
          noiseScale: 0.1,
          noiseStep: 8,
          dimX: 20,
          dimY: 20
        };        
        break;
      case 'debug':
        n = {
          type: 'DebugShader'
        };
        break;
      default:
        break;
    }

    let id = uuidv1();
    this.nodes.allIds.push(id);
    this.nodes.byId[id] = n;

    console.log("added new node",this.nodes);
  }
}

decorate(ObservableStore, {
  nodes: observable,
  canvasWidth: observable,
  canvasHeight: observable,
  generateFlag: observable,
  snapshotFlag: observable,
  addNode: action
});

const observableStore = new ObservableStore();

export default observableStore;