import React from "react";
import { getSnapshot, types, flow, applySnapshot } from "mobx-state-tree";
// import { UndoManager } from "mst-middlewares";
import { PanelStore as Panel, Themes, UIStore } from "maco-ui";
import { PanelVariants, LayoutVariants } from "./ui/Variants";
import defaultSnapshot from "../snapshots/default.json";
import Context from "./ui/Context";
import Messages from "./utils/Messages";
import Transport from "./utils/Transport";
import Collection from "./utils/Collection";
import Parameter from "./ParameterStore";
import Shader from "./ShaderStore";
import Scene from "./SceneStore";
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

const RootStore = types
  .model("RootStore", {
    ui: UIStore,
    scene: types.maybe(Scene),
    selectedParameter: types.maybe(types.safeReference(Parameter)),
    keyFocus: types.maybe(types.string),
    transport: types.optional(Transport, {}),
    shader_collection: types.maybe(Collection),
    recentShaders: types.array(Collection),
    width: 512,
    height: 512
  })
  .volatile(() => ({
    name: "untitled",
    p5_instance: null,
    ready: false,
    breakoutControlled: false,
    messages: Messages.create(),
    context: Context.create()
  }))
  .views(self => ({
    /*
      TODO: recents only update after closing and reopening 
      dropDown. very similar to problem I had earlier where
      the solution was to remove *any derived state*.
      
      try moving the call to recentShaderLibrary to App.js
    */
    recentShaderLibrary() {
      let recents = self.recentShaders;      
      
      let recentItems = {};

      recents.forEach((e, i) => {
        recentItems = {
          ...recentItems,
          ["recent_" + e.name]: {
            id: "recent_" + e.name,
            label: e.name,
            onClick: () => {
              self.scene.shaderGraph.setSelectedByName(e.name);
            }
          }
        };
      }); 
      
      return recentItems;
    },
    shaderLibrary() {
      /*
       currently limited to two levels, just haven't figured out the best
       way to traverse and remap the directory tree
      */
      
      let items = {};
      let collection = self.shader_collection;
      
      console.log('SHADER COLLECTION', getSnapshot(collection))

      collection.children.forEach(e => {
        if (e.type === "file") {
          items = {
            ...items,
            [e.name]: {
              id: e.name,
              label: e.name,
              buttons: {
                edit: {
                  id: "edit",
                  label: "e",
                  title: "edit"
                },
                remove: {
                  id: "remove",
                  label: "x",
                  title: "remove"
                }
              },
              onClick: () => {
                self.addToRecentShaders(
                  Collection.create({ id: e.name, name: e.name })
                );
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
              [c.name]: {
                id: c.name,
                label: c.name,
                buttons: {
                  remove: {
                    id: "remove",
                    label: "x",
                    title: "remove",
                    onClick: event => {
                      // should I add a confirmation?
                      event.preventDefault();
                      event.stopPropagation();
                      e.removeChild(c);
                    }
                  }
                },
                onClick: () => {
                  self.addToRecentShaders(
                    Collection.create({ id: c.name, name: c.name })
                  );
                  self.scene.shaderGraph.setSelectedByName(c.name, c);
                }
              }
            };
          });

          items = {
            ...items,
            [e.name]: {
              id: e.name,
              label: e.name,
              dropDown: {
                ...subitems,
                NewShader: {
                  id: "NewShader",
                  label: "+ New Shader",
                  onClick: () => {
                    // create short random string for new shader name
                    let new_shader = Shader.create({ name: nanoid(5) });

                    e.addChild(
                      Collection.create({
                        id: new_shader.name,
                        name: new_shader.name,
                        type: "file",
                        data: new_shader
                      })
                    );

                    // now save collection to local storage
                    window.localStorage.setItem(
                      "shader_collection",
                      JSON.stringify(getSnapshot(self.shader_collection))
                    );
                  }
                }
              }
            }
          };
        }
      });

      return {
        // Recents: {
        //   id: "Recents",
        //   label: "Recent Shaders",
        //   dropDown: self.recentShaderLibrary()
        // },
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
            Text: {
              id: "Text",
              label: "Text",
              onClick: () =>
                self.scene.shaderGraph.setSelectedByName("TextInput")
            }
          }
        },
        ...items,
        SaveCollection: {
          id: "SaveCollection",
          label: "Save Collection",
          onClick: () => {
            window.localStorage.setItem(
              "shader_collection",
              JSON.stringify(getSnapshot(self.shader_collection))
            );
          }
        }
      };
    }
  }))
  .actions(self => {
    // setUndoManager(self)

    // only when first loaded!
    function afterCreate() {
      window.localStorage.clear();

      // fetch default shaders
      fetchShaderFiles().then(d => {
        self.setupP5();
        self.setScene(Scene.create());

        // applySnapshot(self, defaultSnapshot);
        // self.scene.shaderGraph.update();
        // self.scene.shaderGraph.afterUpdate();

        self.setReady(true);
        // console.log("layouts", getSnapshot(self.ui.layouts.get("MAIN")));
        // self.ui.layouts.get('main').fitScreen();
        // self.ui.layouts.get('main').center();

        // console.log("APP LOCAL STORAGE", window.localStorage);

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
    }

    function load() {
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
          applySnapshot(self, JSON.parse(content));
          self.scene.shaderGraph.update();
          self.scene.shaderGraph.afterUpdate();
          // undoManager.clear();
        };
      };

      link.click();
    }

    function breakout() {
      let new_window = window.open(
        "/output_window.html",
        "window",
        "toolbar=no, menubar=no, resizable=yes"
      );

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
      self.shader_collection = Collection.create({id: 'collection'});

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

    const resizeCanvas = (w, h) => {
      if(!w) w = 1; // never resize canvas to 0
      if(!h) h = 1; // never resize canvas to 0
      self.p5_instance.resizeCanvas(w, h);
      self.width = w;
      self.height = h;

      // update target dimensions
      for (let target_data of self.scene.targets) {
        target_data.ref.resizeCanvas(w, h);
      }
    };

    const addToRecentShaders = shader => {
      // limit to 5
      if(self.recentShaders.length >= 5)
        self.recentShaders.shift();
      
      self.recentShaders.push(shader);
    };

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
      resizeCanvas,
      addToRecentShaders
    };
  });

// export let undoManager = {}
// export const setUndoManager = (targetStore) => {
//   undoManager = UndoManager.create({}, { targetStore })
// }

export default RootStore;
