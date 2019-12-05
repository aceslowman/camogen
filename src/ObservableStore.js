import react from 'react';
import { observable, computed, action, decorate, autorun } from 'mobx';

import GlyphShader from './components/shaders/GlyphShader';
import DebugShader from './components/shaders/DebugShader';

/*
  The store will contain a collection of shader nodes,
  each consisting of a both a shader and a UI element
*/

class ObservableStore {
  // nodes = [
  //   new GlyphShader({
  //     seed: Math.floor(Math.random() * 1000),
  //     noiseScale: 0.1,
  //     noiseStep: 8,
  //     dimX: 20,
  //     dimY: 20
  //   }),
  //   new GlyphShader({
  //     seed: Math.floor(Math.random() * 1000),
  //     noiseScale: 2,
  //     noiseStep: 8,
  //     dimX: 6,
  //     dimY: 6
  //   }),
  //   new DebugShader({
  //     params: 'values'
  //   })
  // ];

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
}

decorate(ObservableStore, {
  nodes: observable,
  canvasWidth: observable,
  canvasHeight: observable,
  generateFlag: observable,
  snapshotFlag: observable
});

const observableStore = new ObservableStore();

export default observableStore;