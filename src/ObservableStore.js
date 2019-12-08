import { observable, computed, action, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';

class ObservableStore {
  nodes = {
    byId: {
      0: {
        type: 'GlyphShader',
        uniforms: {
          seed: Math.floor(Math.random() * 1000),
          noiseScale: 0.1,
          noiseStep: 8,
          dimensions: [20,20]
        }        
      },
      1: {
        type: 'GlyphShader',
        uniforms: {
          seed: Math.floor(Math.random() * 1000),
          noiseScale: 2,
          noiseStep: 8,
          dimensions: [6,6]
        }        
      }
    },
    allIds: [0,1]
  };

  canvasWidth  = 200;
  canvasHeight = 200;

  generateFlag = false;
  snapshotFlag = false;

  sketchReady = false;

  addNode(type) {
    let n;

    switch(type) {
      case 'glyph':
        n = {
          type: 'GlyphShader',
          uniforms: {
            seed: Math.floor(Math.random() * 1000),
            noiseScale: 0.1,
            noiseStep: 8,
            dimensions: [20,20]
          }
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

  resize() {
    
  }

  fitScreen() {
    //
  }

  randomize(id) {
    //
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
  addNode: action,
  removeNode: action,
  resize: action,
  fitScreen: action,
  randomize: action,
  dimensions: computed,
  aspect: computed,
  nodeCount: computed
});

const observableStore = new ObservableStore();

export default observableStore;