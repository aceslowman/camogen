import { types } from "mobx-state-tree";
import { Scene } from './stores/SceneStore';
import { UndoManager } from "mst-middlewares";

/*
  [RootStore]
  |
  [SceneStore]
  |
  [GraphStore] 
  |
  [ShaderGraph]
  |
  [NodeStore] 
  |
  [ShaderStore]  
  |
  [UniformStore]
  |
  [ParameterStore]
*/

const RootStore = types
  .model("RootStore", {    
    scene: types.maybe(Scene),
    openPanels: types.array(types.string),
    ready: false
  })
  .actions(self => {
    setUndoManager(self)

    function afterCreate() {
      self.scene = Scene.create({});
      self.openPanels.push('Shader Graph')
      self.ready = true;
    }

    return {
      afterCreate,
    };
  })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = UndoManager.create({}, { targetStore })
}

export default RootStore;