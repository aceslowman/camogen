import { types, flow, applySnapshot } from "mobx-state-tree";
import { Scene } from './stores/SceneStore';
import { UndoManager } from "mst-middlewares";
import { getSnapshot } from 'mobx-state-tree';
import dirTree from "directory-tree";

import path from 'path';
import { Shader } from "./stores/ShaderStore";
// import { enumeration, maybe } from "mobx-state-tree/dist/internal";

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
      self.scene = Scene.create({});
      self.openPanels.push('Shader Graph');

      fetchShaderFiles()
        .then(() => self.shader_collection.preloadAll())
        .then(() => {
          self.setReady(true);
          console.log('SHADER Collection',getSnapshot(self.shader_collection))
          console.log('getShader',self.scene.shaderGraph.getShader('UV'));
        });
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
          applySnapshot(self, JSON.parse(data));
          undoManager.clear();
        })
      }).catch(err => {/*alert(err)*/});
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

    return {
      afterCreate,
      setReady,
      // setReady: () => undoManager.withoutUndo(setReady),
      save: () => undoManager.withoutUndo(save),
      load: () => undoManager.withoutUndo(load),
      fetchShaderFiles: () => undoManager.withoutUndo(fetchShaderFiles),
    };
  })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = UndoManager.create({}, { targetStore })
}

export default RootStore;

const Collection = types
  .model("Collection", {
    path: types.maybe(types.string),
    name: types.maybe(types.string),
    size: types.maybe(types.number),
    type: types.maybe(types.enumeration("Type",["directory","file"])),
    children: types.maybe(types.array(types.late(()=>Collection))),
    extension: types.maybe(types.string),
    data: types.maybe(Shader),
  })
  .views(self => ({
    getByName: (name) => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          if(next_node.name === name) result.push(next_node);          

          if (next_node.children) {
            container = container.concat(next_node.children) // depth first search              
          }
        }
      }

      return (result.length === 1) ? result[0] : result;
    }
  }))
  .actions(self => {
    const preloadAll = flow(function* preloadAll() {
      // console.log('preloading', self)

      if(self.children) {
        yield Promise.all(self.children.map(flow(function*(e,i){
          yield e.preloadAll();
        })))
      } else if(self.type === "file"){
        // let shader = Shader.create();
        // applySnapshot(shader,JSON.parse(yield fs.promises.readFile(self.path)));
        let result = yield fs.promises.readFile(self.path);
        self.data = JSON.parse(result);
      }
    });

    return {
      preloadAll
    }
  })