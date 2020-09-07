import { types, flow, applySnapshot } from "mobx-state-tree";
import { Scene } from './stores/SceneStore';
import { UndoManager } from "mst-middlewares";
import { getSnapshot } from 'mobx-state-tree';
import dirTree from "directory-tree";
import path from 'path';
import Collection from './stores/utils/Collection';
import defaultSnapshot from './snapshots/default.json';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

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
    shader_collection: types.maybe(types.late(() => Collection)),
    ready: false
  })
  .actions(self => {
    setUndoManager(self)

    function afterCreate() {
      fetchShaderFiles()
        .then(() => self.shader_collection.preloadAll())
        .then(() => {
          self.setScene(Scene.create({}));

          // apply default
          applySnapshot(self.scene, defaultSnapshot.scene);

          self.addPanel('Debug');
          self.addPanel('Shader Graph');
          self.addPanel('Shader Controls');

          self.setReady(true);
        });
    }

    function setScene(scene) {
      self.scene = scene;
    }

    function setReady(value) {
      self.ready = value;
    }

    function save() {
      let options = {
          title: 'Save Scene File',
          defaultPath: path.join(app.getPath("desktop"),`untitled.scene.camo`), 
          buttonLabel: "Save",
          filters: [
              {name: 'Camo Scene Files', extensions: ['scene.camo']},
          ]
      }

      dialog.showSaveDialog(options).then((f)=>{
          let content = JSON.stringify(getSnapshot(self));

          fs.writeFile(f.filePath, content, (err)=>{
              if(err) {         
                  console.error("an error has occurred: "+err.message);
              } else {
                  console.log('scene has been saved at file:/'+f.filePath)
              }                
          });
          
      }).catch(err => console.error(err));
    }

    function load() {
      let options = {
          title: 'Load Scene File',
          defaultPath: app.getPath("desktop"),
          buttonLabel: "Load",
          filters: [{
              name: 'Camo Scene Files',
              extensions: ['scene.camo']
          }, ]
      }

      dialog.showOpenDialog(options).then((f) => {
        let content = f.filePaths[0];
        fs.readFile(content, 'utf-8', (err, data) => {
          if(err) console.error(err.message);
          // console.log(JSON.parse(data))
          // applySnapshot(self, JSON.parse(data));
          

          // only deserialize scene.
          applySnapshot(self.scene, JSON.parse(data).scene);

          // undoManager.clear();
        })
      }).catch(err => {/*alert(err)*/});
    }

    function addPanel(panel) {
      self.openPanels.push(panel);
    }

    /*
        fetchShaderFiles()

        loads all custom shaders from the users directory

        if no factory shaders are found, they will be automatically
        loaded from `default_shaders_path`. 

        the user shaders are located at:
        
          macOS: ~/Library/Application Support
          Linux: ~/.config
          Windows: %APPDATA%
      */
    const fetchShaderFiles = flow(function* fetchShaderFiles() {
      self.shader_collection = Collection.create();
      
      let default_shaders_path = app.isPackaged ?
        path.join(app.getAppPath(), '../shaders') :
        path.join(app.getAppPath(), 'shaders');
      let user_shaders_path = path.join(app.getPath("userData"), 'shaders');

      try {
        // check if path exists
        yield fs.promises.access(user_shaders_path);

        let tree = dirTree(user_shaders_path);

        applySnapshot(self.shader_collection,tree);
      } catch(err) {
        console.error("failed to fetch shaders", err);
      }
    });

    function removePanel(name) {
      let index = self.openPanels.indexOf(name);
      if (index > -1) {
        self.openPanels.splice(index, 1)
      }
    }

    return {
      afterCreate,
      setReady,
      // setScene: () => undoManager.withoutUndo(setScene),
      setScene,
      addPanel,
      removePanel,
      // setReady: () => undoManager.withoutUndo(setReady),
      save: () => undoManager.withoutUndo(save),
      load: () => undoManager.withoutUndo(load),
      fetchShaderFiles: () => undoManager.withoutUndoFlow(fetchShaderFiles),
    };
  })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = UndoManager.create({}, { targetStore })
}

export default RootStore;

