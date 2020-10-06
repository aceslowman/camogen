import { types, flow, applySnapshot } from "mobx-state-tree";
import Scene from './SceneStore';
// import { UndoManager } from "mst-middlewares";
import { getSnapshot } from 'mobx-state-tree';
import dirTree from "directory-tree";
import Collection from './utils/Collection';
// import defaultSnapshot from '../snapshots/default.json';
import Runner from '../Runner';
import p5 from 'p5';

import path from 'path';
import Workspace, {DefaultParameter} from "./utils/Workspace";
import Messages from "./utils/Messages";
import { Themes } from "maco-ui";
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
    theme: types.frozen(Themes.yutani),
    selectedParameter: types.maybe(types.safeReference(Parameter)),
    keyFocus: types.maybe(types.string)
  })
  .volatile(self => ({
    p5_instance: null,
    shader_collection: null,
    ready: false,
    breakoutControlled: false,
    messages: Messages.create(),
  }))
  .actions(self => {
    // setUndoManager(self)

    // only when first loaded!
    function afterCreate() {
      fetchShaderFiles()
        .then(() => self.shader_collection.preloadAll())
        .then(() => {
          self.setupP5();

          self.setScene(Scene.create());

          // apply default
          // TEMP: removed while working on param graphs
          // applySnapshot(self.scene, defaultSnapshot.scene);
          self.setReady(true);
        });
    }

    function setTheme(primary, secondary, text, accent) {
      self.theme = {
        primary: primary,
        secondary: secondary,
        text: text,
        accent: accent,
      }
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
      if(param && !param.graph) param.createGraph();
      self.selectedParameter = param;
    }

    function save() {
      let options = {
          title: 'Save Project File',
          defaultPath: path.join(app.getPath("desktop"),`untitled.camo`), 
          buttonLabel: "Save",
          filters: [              
              {
                name: 'Camo Project Files',
                extensions: ['camo']
              },
              {
                name: 'Any',
                extensions: ['*']
              },
          ]
      }

      dialog.showSaveDialog(options).then((f)=>{
          let content = JSON.stringify(getSnapshot(self));

          fs.writeFile(f.filePath, content, (err)=>{
              if(err) {         
                  console.error("an error has occurred: "+err.message);
              } else {
                  console.log('project has been saved at: '+f.filePath)
              }                
          });
          
      }).catch(err => console.error(err));
    }

    function load() {
      let options = {
          title: 'Load Project File',
          defaultPath: app.getPath("desktop"),
          buttonLabel: "Load",
          filters: [{
              name: 'Camo Project Files',
              extensions: ['camo']
            },
            {
              name: 'Any',
              extensions: ['*']
            },
          ]
      }

      dialog.showOpenDialog(options).then((f) => {
        
        let content = f.filePaths[0];
        fs.readFile(content, 'utf-8', (err, data) => {
          if(err) console.error(err.message);

          self.scene.clear();
          
          applySnapshot(self, JSON.parse(data));

          self.scene.shaderGraph.update();
          self.scene.shaderGraph.afterUpdate();
          
          // undoManager.clear();
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

      yield dialog.showSaveDialog(options).then((f) => {      
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
      setTheme,
      selectParameter,
      breakout,
      onBreakoutResize,
      save, load, fetchShaderFiles, snapshot
      // save: () => undoManager.withoutUndo(save),
      // load: () => undoManager.withoutUndo(load),
      // fetchShaderFiles: () => undoManager.withoutUndo(fetchShaderFiles),
      // snapshot: () => undoManager.withoutUndo(snapshot),
    };
  })

// export let undoManager = {}
// export const setUndoManager = (targetStore) => {
//   undoManager = UndoManager.create({}, { targetStore })
// }

export default RootStore;

