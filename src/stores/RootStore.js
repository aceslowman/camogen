import React from "react";
import {
  onSnapshot,
  getSnapshot,
  types,
  flow,
  applySnapshot,
  destroy
} from "mobx-state-tree";
import { PanelStore as Panel, Themes, UIStore } from "maco-ui";
import { PanelVariants, LayoutVariants } from "./ui/Variants";
import defaultSnapshot from "../snapshots/default.json";
import Messages from "./utils/Messages";
import Transport from "./utils/Transport";
import Collection from "./utils/Collection";
import Parameter from "./ParameterStore";
import Shader from "./shaders/ShaderStore";
import Scene from "./SceneStore";
import MediaLibrary from "./MediaLibrary";
import Runner from "../Runner";
import { nanoid } from "nanoid";
import p5 from "p5";

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

const currentDate = new Date();

const RootStore = types
  .model("RootStore", {
    version: "v1.1.4-alpha",
    name: `${currentDate.getMonth() +
      1}-${currentDate.getDate()}-${currentDate.getFullYear()}`,
    ui: UIStore,
    scene: types.maybe(Scene),
    selectedParameter: types.safeReference(Parameter),
    selectedShader: types.safeReference(Collection),
    keyFocus: types.maybe(types.string),
    transport: types.optional(Transport, {}),
    mediaLibrary: types.maybe(MediaLibrary),
    shader_collection: types.maybe(Collection),
    recentShaders: types.array(types.safeReference(Collection)),
    width: 512,
    height: 512
  })
  .volatile(() => ({
    p5_instance: null,
    ready: false,
    breakoutControlled: false,
    messages: Messages.create(),
    missingAssets: [],
    // 'show' individual panels
    showSplash: null,
    showUpdates: null,
    showMissingAssets: null,
    updateFlag: false
  }))
  .views(self => ({
    get canvas() {
      return self.p5_instance.canvas;
    },
    get recentShaderLibrary() {
      let recentItems = {};

      self.recentShaders.forEach((e, i) => {
        recentItems = {
          ...recentItems,
          [e.id]: {
            id: e.id,
            label: e.name,
            onClick: () => {
              self.scene.shaderGraph.setSelectedByName(e.name);
            }
          }
        };
      });

      return recentItems;
    },
    get shaderLibrary() {
      /*
       currently limited to two levels, just haven't figured out the best
       way to traverse and remap the directory tree
       
       NOTE: I think I started addressing this in the Collection class
      */

      let items = {};
      let collection = self.shader_collection;

      collection.children.forEach(e => {
        if (e.type === "file") {
          items = {
            ...items,
            [e.id]: {
              id: e.id,
              label: e.name,
              buttons: {
                // NOTE: taking out the 'remove' button
                // to prevent accidental data loss
                // remove: {
                //   id: "remove",
                //   label: "x",
                //   title: "remove"
                // }
              },
              onClick: () => {
                self.addToRecentShaders(e);
                self.scene.shaderGraph.setSelectedByName(e.name, e);
              }
            }
          };
        } else if (e.type === "directory") {
          let subitems = {};

          // get all dropdown items
          e.children.forEach(c => {
            subitems = {
              ...subitems,
              [c.id]: {
                id: c.id,
                label: c.name,
                buttons: {
                  // NOTE: taking out the 'remove' button
                  // to prevent accidental data loss
                  // remove: {
                  //   id: "remove",
                  //   label: "x",
                  //   title: "remove",
                  //   onClick: event => {
                  //     // should I add a confirmation?
                  //     event.preventDefault();
                  //     event.stopPropagation();
                  //     e.removeChild(c);
                  //   }
                  // }
                },
                onClick: () => {
                  self.addToRecentShaders(c);
                  self.scene.shaderGraph.setSelectedByName(c.name, c);
                }
              }
            };
          });

          items = {
            ...items,
            [e.id]: {
              id: e.id,
              label: e.name,
              dropDown: {
                ...subitems
                //                 NewShader: {
                //                   id: "NewShader",
                //                   label: "+ New Shader",
                //                   onClick: () => {
                //                     // create short random string for new shader name
                //                     let new_shader = Shader.create({ name: nanoid(5) });

                //                     e.addChild(
                //                       Collection.create({
                //                         id: new_shader.name,
                //                         name: new_shader.name,
                //                         type: "file",
                //                         data: new_shader
                //                       })
                //                     );

                //                     self.persistShaderCollection();
                //                   }
                //                 }
              }
            }
          };
        }
      });

      return {
        Recents: {
          id: "Recents",
          label: "Recent Shaders",
          dropDown: self.recentShaderLibrary
        },
        Inputs: {
          id: "Inputs",
          label: "Inputs",
          dropDown: {
            Webcam: {
              id: "Webcam",
              label: "Webcam",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("WebcamInput")
            },
            Image: {
              id: "Image",
              label: "Image",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("ImageInput")
            },
            Video: {
              id: "Video",
              label: "Video",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("VideoInput")
            },
            Text: {
              id: "Text",
              label: "Text",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("TextInput")
            },
            Sketch: {
              id: "Sketch",
              label: "Sketch",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("SketchInput")
            }
          }
        },
        ...items,
        PersistCollection: {
          id: "PersistCollection",
          label: "Persist Collection",
          onClick: () => {
            self.persistShaderCollection();
          }
        },
        SaveCollection: {
          id: "SaveCollection",
          label: "Save Collection",
          onClick: () => {
            self.saveShaderCollection();
          }
        },
        LoadCollection: {
          id: "LoadCollection",
          label: "Load Collection",
          onClick: () => {
            self.loadShaderCollection();
          }
        }
      };
    }
  }))
  .actions(self => ({
    afterCreate: () => {
      // window.localStorage.clear();

      if (window.localStorage.getItem("showSplash") !== null) {
        self.showSplash = JSON.parse(window.localStorage.getItem("showSplash"));
      } else {
        window.localStorage.setItem("showSplash", true);
        self.showSplash = true;
      }

      if (window.localStorage.getItem("showUpdates") !== null) {
        self.showUpdates = JSON.parse(
          window.localStorage.getItem("showUpdates")
        );
      } else {
        window.localStorage.setItem("showUpdates", true);
        self.showUpdates = true;
      }

      // fetch default shaders
      self.fetchShaderFiles().then(d => {
        self.setupP5();
        self.setScene(Scene.create());

        // applySnapshot(self, defaultSnapshot);
        // self.scene.shaderGraph.update();
        // self.scene.shaderGraph.afterUpdate();

        // self.setReady(true);
        // console.log("layouts", getSnapshot(self.ui.layouts.get("MAIN")));
        // self.ui.layouts.get('main').fitScreen();
        // self.ui.layouts.get('main').center();

        // console.log("APP LOCAL STORAGE", window.localStorage);

        // remove loading overlay
        document.querySelector(".loading").style.display = "none";
      });

      // set up media library
      self.mediaLibrary = MediaLibrary.create({ id: nanoid() });
    },

    setupP5: () => {
      self.p5_instance = new p5(p => Runner(p, self));
    },

    setUpdateFlag: () => {
      self.updateFlag = !self.updateFlag;
    },

    selectParameter: param => {
      if (param && !param.graph) param.createGraph();
      self.selectedParameter = param;
    },

    selectShader: shader => {
      self.selectedShader = shader;
    },

    save: () => {
      let src = JSON.stringify(getSnapshot(self));
      let blob = new Blob([src], { type: "text/plain" });

      let link = document.createElement("a");
      link.download = `${self.name}.camo`;

      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        link.href = window.webkitURL.createObjectURL(blob);
      } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        link.href = window.URL.createObjectURL(blob);
        link.onclick = e => {
          document.body.removeChild(e.target);
        };
        link.style.display = "none";
        document.body.appendChild(link);
      }

      link.click();
      window.localStorage.setItem("recent_save", src);

      console.log("project saved!");
    },

    //     does this need to be flow?
    load: flow(function* load() {
      let link = document.createElement("input");
      link.type = "file";

      link.onchange = e => {
        var file = e.target.files[0];

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = e => {
          let content = e.target.result;

          self.setName(name);
          self.scene.clear();
          console.log("clearing");
          // destroy(self.scene)

          applySnapshot(self, JSON.parse(content));
          self.scene.shaderGraph.update();
          self.scene.shaderGraph.afterUpdate();
          // undoManager.clear();
        };
      };

      link.click();
    }),

    loadRecentSave: () => {
      let content = window.localStorage.getItem("recent_save");

      if (content) {
        self.setName(name);
        self.scene.clear(); // this just fails early
        console.log("clearing");
        // destroy(self.scene)

        applySnapshot(self, JSON.parse(content));
        self.scene.shaderGraph.update();
        self.scene.shaderGraph.afterUpdate();
      } else {
        console.log("no recent saves!");
      }
    },

    flagAssetsAsMissing: model => {
      let missing_asset_filename = getSnapshot(model).user_filename;
      self.missingAssets.push(model);
      console.log("MISSING_ASSETS", self.missingAssets);
      self.showMissingAssets = true;
    },

    breakout: () => {
      let new_window = window.open(
        "/output_window.html",
        "window",
        "toolbar=no, menubar=no, resizable=yes"
      );

      new_window.updateDimensions = (w, h) => self.onBreakoutResize(w, h);
      new_window.gl = self.p5_instance.canvas.getContext("2d");

      self.breakoutControlled = true;
    },

    onBreakoutResize: (w, h) => {
      self.p5_instance.resizeCanvas(w, h);

      // update target dimensions
      for (let target_data of self.scenes[0].targets) {
        target_data.ref.resizeCanvas(w, h);
      }

      self.p5_instance.draw();
    },

    fetchShaderFiles: flow(function* fetchShaderFiles() {
      /*
          fetchShaderFiles()

          loads all shaders. defaults to the users localStorage,
          but if that fails, it will phone home for a default 
          shader collection
      */
      try {
        if (window.localStorage.getItem("shader_collection")) {
          console.log("cached shaders found, loading...", window.localStorage);

          let data = JSON.parse(
            window.localStorage.getItem("shader_collection")
          );

          self.setShaderCollection(data);

          // should be changed to match the flow / yield syntax
          return new Promise((res, rej) => {
            res();
          });
        } else {
          console.log("no cached shaders found, fetching from server...");

          yield fetch("api/shaders")
            .then(d => d.json())
            .then(d => {
              self.setShaderCollection(d);
              window.localStorage.setItem(
                "shader_collection",
                JSON.stringify(getSnapshot(self.shader_collection))
              );
            });
        }
      } catch (err) {
        console.error("failed to fetch shaders", err);
      }
    }),

    reloadDefaults: () => {
      window.localStorage.clear();
      self.fetchShaderFiles();
    },

    saveShaderCollection: () => {
      console.log("saving collection");

      let src = JSON.stringify(getSnapshot(self.shader_collection));
      let blob = new Blob([src], { type: "text/plain" });

      let link = document.createElement("a");
      link.download = `${self.name}.camo.collection`;

      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        link.href = window.webkitURL.createObjectURL(blob);
      } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        link.href = window.URL.createObjectURL(blob);
        link.onclick = e => {
          document.body.removeChild(e.target);
        };
        link.style.display = "none";
        document.body.appendChild(link);
      }

      link.click();
    },

    loadShaderCollection: () => {
      let link = document.createElement("input");
      link.type = "file";

      link.onchange = e => {
        var file = e.target.files[0];

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = e => {
          let content = e.target.result;

          self.setShaderCollection(JSON.parse(content));

          // TODO: is this all still necessary to keep around?
          // applySnapshot(self.shader_collection, JSON.parse(content));
          //           self.setName(name);
          //           self.scene.clear();
          //           applySnapshot(self, JSON.parse(content));
          //           self.scene.shaderGraph.update();
          //           self.scene.shaderGraph.afterUpdate();
          // undoManager.clear();
        };
      };

      link.click();
    },

    persistShaderCollection: () => {
      // save collection to local storage
      window.localStorage.setItem(
        "shader_collection",
        JSON.stringify(getSnapshot(self.shader_collection))
      );
    },

//     persistLayouts: () => {
//       // save layouts to local storage
//       window.localStorage.setItem(
//         "layouts",
//         JSON.stringify(self.ui.layoutVariants)
//       );
      
//       console.log('persisting layouts', JSON.stringify(self.ui.layoutVariants))
//     },

    resizeCanvas: (w, h) => {
      if (!w) w = 1; // never resize canvas to 0
      if (!h) h = 1; // never resize canvas to 0
      self.p5_instance.resizeCanvas(w, h);
      self.width = w;
      self.height = h;

      // update target dimensions
      for (let target_data of self.scene.targets) {
        target_data.ref.resizeCanvas(w, h);
      }
    },

    addToRecentShaders: shader => {
      // limit to 5
      if (self.recentShaders.length >= 5) self.recentShaders.shift();
      self.recentShaders.push(shader.id);
    },

    setTheme: theme => (self.theme = theme),

    setScene: scene => (self.scene = scene),

    setReady: value => (self.ready = value),

    setName: name => (self.name = name),

    setShaderCollection: c => (self.shader_collection = c),

    setShowSplash: s => (self.showSplash = s),

    setShowUpdates: s => (self.showUpdates = s),

    setShowMissingAssets: s => (self.showMissingAssets = s)
  }));

export default RootStore;
