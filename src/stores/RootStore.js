import { types, flow, applySnapshot } from "mobx-state-tree";
import Scene from "./SceneStore";
// import { UndoManager } from "mst-middlewares";
import { getSnapshot } from "mobx-state-tree";

// import dirTree from "directory-tree";
import Collection from "./utils/Collection";
import Layout, { CoreLayouts } from "./ui/Layout";
import defaultSnapshot from "../snapshots/default.json";
import Runner from "../Runner";
import p5 from "p5";

// import path from 'path';
import Context from "./ui/Context";
import Messages from "./utils/Messages";
import { Themes } from "maco-ui";
import Parameter from "./ParameterStore";
import Panel from "./ui/Panel";
import Transport from "./utils/Transport";

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
    layout: types.optional(Layout, CoreLayouts["WELCOME"]),
    mainPanel: types.optional(Panel, {
      id: "main",
      // title: "camogen",
      floating: true,
      canFloat: false,
      collapsible: true,
      fullscreen: false,
      canFullscreen: true,
      dimensions: [700, 500],
      position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250]
    }),
    mainCanvasPanel: types.optional(Panel, {
      id: "canvas",
      title: "canvas",
      floating: true,
      canFloat: false,
      collapsible: true,
      fullscreen: true,
      canFullscreen: true,
      dimensions: [window.innerWidth, window.innerHeight],
      position: [0, 0]
    }),
    theme: types.frozen(Themes.yutani),
    selectedParameter: types.maybe(types.safeReference(Parameter)),
    keyFocus: types.maybe(types.string),
    transport: types.optional(Transport, {})
  })
  .volatile(() => ({
    name: "untitled",
    p5_instance: null,
    shader_collection: null,
    ready: false,
    breakoutControlled: false,
    messages: Messages.create(),
    context: Context.create()
  }))
  .views(self => ({
    shaderLibrary() {
      /*
       currently limited to two levels, just haven't figured out the best
       way to traverse and remap the directory tree
      */
      let collection = self.shader_collection;

      let items = [];

      collection.children.forEach(e => {
        if (e.type === "file") {
          items.push({
            label: e.name,
            onClick: () => self.scene.shaderGraph.setSelectedByName(e.name)
          });
        } else if (e.type === "directory") {
          let subitems = e.children.map(c => {
            let next = {
              label: c.name,
              onClick: () => self.scene.shaderGraph.setSelectedByName(c.name)
            };

            return next;
          });

          items.push({
            label: e.name,
            dropDown: subitems
          });
        }
      });

      return [
        {
          label: "Inputs",
          dropDown: [
            {
              label: "Webcam",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("WebcamInput")
            },
            {
              label: "Image",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("ImageInput")
            }
          ]
        },
        ...items
      ];
    }
  }))
  .actions(self => {
    // setUndoManager(self)

    // only when first loaded!
    function afterCreate() {
      // window.localStorage.clear();

      // fetch default shaders
      fetchShaderFiles().then(d => {
        self.setupP5();
        self.setScene(Scene.create());

        applySnapshot(self, defaultSnapshot);
        self.scene.shaderGraph.update();
        self.scene.shaderGraph.afterUpdate();

        self.setReady(true);

        self.mainPanel.fitScreen();

        console.log("APP LOCAL STORAGE", window.localStorage);

        // remove loading overlay
        document.querySelector(".loading").style.display = "none";
      });
    }

    function setTheme(theme) {
      self.theme = theme;
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

    function setName(name) {
      self.name = name;
    }

    function selectParameter(param) {
      if (param && !param.graph) param.createGraph();
      self.selectedParameter = param;
    }

    function save() {
      console.log("saving project");

      let src = JSON.stringify(getSnapshot(self));
      let blob = new Blob([src], { type: "text/plain" });

      let link = document.createElement("a");
      link.download = "project.camo";

      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        link.href = window.webkitURL.createObjectURL(blob);
      } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        link.href = window.URL.createObjectURL(blob);
        link.onclick = e => { document.body.removeChild(e.target) };
        link.style.display = "none";
        document.body.appendChild(link);
      }

      link.click();
      
      //       let options = {
      //           title: 'Save Project File',
      //           defaultPath: path.join(app.getPath("desktop"),`${self.name}.camo`),
      //           buttonLabel: "Save",
      //           filters: [
      //               {
      //                 name: 'Camo Project Files',
      //                 extensions: ['camo']
      //               },
      //               {
      //                 name: 'Any',
      //                 extensions: ['*']
      //               },
      //           ]
      //       }
      //       dialog.showSaveDialog(options).then((f)=>{
      //           let name = f.filePath.split('/').pop().split('.')[0];
      //           self.setName(name);
      //           let content = JSON.stringify(getSnapshot(self));
      //           fs.writeFile(f.filePath, content, (err)=>{
      //               if(err) {
      //                   console.error("an error has occurred: "+err.message);
      //               } else {
      //                   console.log('project has been saved at: '+f.filePath)
      //               }
      //           });
      //       }).catch(err => console.error(err));
    }

    function load() {
      //       let options = {
      //           title: 'Load Project File',
      //           defaultPath: app.getPath("desktop"),
      //           buttonLabel: "Load",
      //           filters: [{
      //               name: 'Camo Project Files',
      //               extensions: ['camo']
      //             },
      //             {
      //               name: 'Any',
      //               extensions: ['*']
      //             },
      //           ]
      //       }
      //       dialog.showOpenDialog(options).then((f) => {
      //         let content = f.filePaths[0];
      //         fs.readFile(content, 'utf-8', (err, data) => {
      //           if(err) console.error(err.message);
      //           let name = content.split('/').pop().split('.')[0];
      //           self.setName(name);
      //           self.scene.clear();
      //           applySnapshot(self, JSON.parse(data));
      //           self.scene.shaderGraph.update();
      //           self.scene.shaderGraph.afterUpdate();
      //           // undoManager.clear();
      //         })
      //       }).catch(err => {/*alert(err)*/});
    }

    /*
      breakout()
    */
    function breakout() {
      let new_window = window.open("/output_window.html");
      new_window.updateDimensions = (w, h) => self.onBreakoutResize(w, h);
      new_window.gl = self.p5_instance.canvas.getContext("2d");

      self.breakoutControlled = true;
    }

    function onBreakoutResize(w, h) {
      self.p5_instance.resizeCanvas(w, h);

      // update target dimensions
      for (let target_data of self.scenes[0].targets) {
        target_data.ref.resizeCanvas(w, h);
      }

      self.p5_instance.draw();
    }

    /*
        fetchShaderFiles()

        loads all shaders. defaults to the users localStorage,
        but if that fails, it will phone home for a default 
        shader collection
    */
    const fetchShaderFiles = flow(function* fetchShaderFiles() {
      self.shader_collection = Collection.create();

      try {
        if (window.localStorage.getItem("shader_collection")) {
          console.log("cached shaders found, loading...", window.localStorage);

          let data = JSON.parse(
            window.localStorage.getItem("shader_collection")
          );

          applySnapshot(self.shader_collection, data);

          // should be changed to match the flow / yield syntax
          return new Promise((res, rej) => {
            res();
          });
        } else {
          console.log("no cached shaders found, fetching from server...");

          yield fetch("api/shaders")
            .then(d => d.json())
            .then(d => {
              applySnapshot(self.shader_collection, d);
              window.localStorage.setItem(
                "shader_collection",
                JSON.stringify(getSnapshot(self.shader_collection))
              );
            });
        }
      } catch (err) {
        console.error("failed to fetch shaders", err);
      }
    });

    /*
      snapshot()

      saves an image of the current scene
    */
    const snapshot = flow(function* snapshot(format = "PNG") {
      //       var dataURL;
      //       switch(format) {
      //         case "PNG":
      //           dataURL = self.p5_instance.canvas.toDataURL("image/png");
      //           break;
      //         case "JPEG":
      //           let quality = 10;
      //           dataURL = self.p5_instance.canvas.toDataURL("image/jpeg", quality);
      //           break;
      //         default:
      //           dataURL = self.p5_instance.canvas.toDataURL("image/png");
      //       }
      //       var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
      //       var content = new Buffer(data, 'base64');
      //       let path = `${app.getPath("userData")}/snapshots`;
      //       let options = {
      //         defaultPath: path,
      //         buttonLabel: "Save Image",
      //       }
      //       yield dialog.showSaveDialog(options).then((f) => {
      //         fs.writeFile(f.filePath, content, "base64", (err) => {
      //           if (err) {
      //             console.log("an error has occurred: " + err.message);
      //           } else {
      //             console.log("snapshot saved",f.filePath);
      //           }
      //         });
      //       }).catch(err => {
      //         console.error(err)
      //       });
    });

    return {
      afterCreate,
      setReady,
      setScene,
      setupP5,
      setTheme,
      setName,
      selectParameter,
      breakout,
      onBreakoutResize,
      save,
      load,
      fetchShaderFiles,
      snapshot
      // save: () => undoManager.withoutUndo(save),
      // load: () => undoManager.withoutUndo(load),
      // fetchShaderFiles: () => undoManager.withoutUndo(fetchShaderFiles),
      // snapshot: () => undoManager.withoutUndo(snapshot),
    };
  });

// export let undoManager = {}
// export const setUndoManager = (targetStore) => {
//   undoManager = UndoManager.create({}, { targetStore })
// }

export default RootStore;
