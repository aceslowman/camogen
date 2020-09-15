import { types, flow, applySnapshot } from "mobx-state-tree";
import Scene from './SceneStore';
import { UndoManager } from "mst-middlewares";
import { getSnapshot } from 'mobx-state-tree';
import dirTree from "directory-tree";
import Collection from './utils/Collection';
import defaultSnapshot from '../snapshots/default.json';
import Runner from '../Runner';
import p5 from 'p5';

import path from 'path';
import Workspace, {DefaultShaderEdit, DefaultDebug, DefaultParameter} from "./utils/Workspace";
import Messages from "./utils/Messages";
import Parameter from "./ParameterStore";
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
    workspace: types.optional(Workspace, DefaultParameter),
    shader_collection: types.maybe(types.late(() => Collection)),
    ready: false,
    breakoutControlled: false,
    messages: types.maybe(Messages),
    selectedParameter: types.maybe(types.reference(Parameter))
  })
  .volatile(self => ({
    p5_instance: null
  }))
  .actions(self => {
    setUndoManager(self)

    function afterCreate() {
      self.messages = Messages.create();

      fetchShaderFiles()
        .then(() => self.shader_collection.preloadAll())
        .then(() => {
          self.setupP5();
          self.setScene(Scene.create({}));

          // apply default
          // TEMP: removed while working on param graphs
          // applySnapshot(self.scene, defaultSnapshot.scene);

          self.setReady(true);
        });
    }

    function setupP5() {
      self.p5_instance = new p5(p => Runner(p, self));
    }

    function setScene(scene) {
      self.scene = scene;
    }

    function setReady(value) {
      self.ready = value;
    }

    function selectParameter(param) {
      self.selectedParameter = param;
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
          // only deserialize scene.
          applySnapshot(self.scene, JSON.parse(data).scene);
          self.scene.shaderGraph.update();
          undoManager.clear();
        })
      }).catch(err => {/*alert(err)*/});
    }

    /*
      breakout()
    */
    function breakout() {
      let new_window = window.open('/output_window.html');
      new_window.updateDimensions = (w,h) => self.onBreakoutResize(w,h);
      new_window.gl = self.p5_instance.canvas.getContext('2d');
      
      self.breakoutControlled = true;
    }

    function onBreakoutResize(w,h) {
      self.p5_instance.resizeCanvas(w,h);

      // update target dimensions
      for (let target_data of self.scenes[0].targets) {
        target_data.ref.resizeCanvas(w,h);
      }

      self.p5_instance.draw();
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
      
      // let default_shaders_path = app.isPackaged ?
      //   path.join(app.getAppPath(), '../shaders') :
      //   path.join(app.getAppPath(), 'shaders');
      let user_shaders_path = path.join(app.getPath("userData"), 'shaders');

      try {
        // check if path exists
        yield fs.promises.access(user_shaders_path);

        let tree = dirTree(user_shaders_path);
        // console.log(tree)

        applySnapshot(self.shader_collection,tree);
      } catch(err) {
        console.error("failed to fetch shaders", err);
      }
    }); 
    
    /*
      snapshot()

      saves a png of the current scene
    */
    const snapshot = flow(function* snapshot() {
      var dataURL = self.p5_instance.canvas.toDataURL("image/png");

      var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
      var content = new Buffer(data, 'base64');
      
      let path = `${app.getPath("userData")}/snapshots`;

      let options = {
        title: self.name + '.shader',
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
    });

    return {
      afterCreate,
      setReady,
      setScene,
      setupP5,
      selectParameter,
      breakout,
      onBreakoutResize,
      save: () => undoManager.withoutUndo(save),
      load: () => undoManager.withoutUndo(load),
      fetchShaderFiles: () => undoManager.withoutUndo(fetchShaderFiles),
      snapshot: () => undoManager.withoutUndo(snapshot),
      snapshot
    };
  })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = UndoManager.create({}, { targetStore })
}

export default RootStore;

