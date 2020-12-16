import { types } from "mobx-state-tree";
import tinykeys from "tinykeys";
import { observable } from 'mobx';

export const ContextMenuItem = types
  .model("ContextMenuItem", {
    id: types.identifier,
    label: types.frozen(), 
    buttons: types.frozen(), 
    dropDown: types.map(types.late(()=>ContextMenuItem))
  })
  .volatile(self => ({
    onClick: () => {}
  }))

const Context = types
  .model("Context", {})
  .volatile(self => ({
    contextmenu: {},
    keylistener: tinykeys(window, {}),
    keymap: null
  }))
  .actions(self => ({
    setKeymap: keymap => {
      if (self.keylistener) self.keylistener();

      self.keymap = keymap;
      self.keylistener = tinykeys(window, self.keymap);
    },
    removeKeymap: () => self.keylistener(),
    setContextmenu: c => {
      console.log('set context menu',c)
      self.contextmenu = c
    }
  }));

export default Context;

// get recentShaderLibrary() {
//       let recentItems = {};
      
//       self.recentShaders.forEach((e, i) => {
//         recentItems = {
//           ...recentItems,
//           [e.id]: {
//             id: e.id,
//             label: e.name,
//             onClick: () => {
//               self.scene.shaderGraph.setSelectedByName(e.name);
//             }
//           }
//         };
//       });

//       return recentItems;
//     },
//     get shaderLibrary() {
//       /*
//        currently limited to two levels, just haven't figured out the best
//        way to traverse and remap the directory tree
//       */

//       let items = {};
//       let collection = self.shader_collection;

//       collection.children.forEach(e => {
//         if (e.type === "file") {
//           items = {
//             ...items,
//             [e.id]: {
//               id: e.id,
//               label: e.name,
//               buttons: {
//                 remove: {
//                   id: "remove",
//                   label: "x",
//                   title: "remove"
//                 }
//               },
//               onClick: () => {
//                 self.addToRecentShaders(e);
//                 self.scene.shaderGraph.setSelectedByName(e.name, e);
//               }
//             }
//           };
//         } else if (e.type === "directory") {
//           let subitems = {};

//           // get all dropdown items
//           e.children.forEach(c => {
//             subitems = {
//               ...subitems,
//               [c.id]: {
//                 id: c.id,
//                 label: c.name,
//                 buttons: {
//                   remove: {
//                     id: "remove",
//                     label: "x",
//                     title: "remove",
//                     onClick: event => {
//                       // should I add a confirmation?
//                       event.preventDefault();
//                       event.stopPropagation();
//                       e.removeChild(c);
//                     }
//                   }
//                 },
//                 onClick: () => {
//                   self.addToRecentShaders(c);
//                   self.scene.shaderGraph.setSelectedByName(c.name, c);
//                 }
//               }
//             };
//           });

//           items = {
//             ...items,
//             [e.id]: {
//               id: e.id,
//               label: e.name,
//               dropDown: {
//                 ...subitems,
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

//                     self.persistShaderLibrary()
//                   }
//                 }
//               }
//             }
//           };
//         }
//       });

//       return {
//         Recents: {
//           id: "Recents",
//           label: "Recent Shaders",
//           dropDown: self.recentShaderLibrary
//         },
//         Inputs: {
//           id: "Inputs",
//           label: "Inputs",
//           dropDown: {
//             Webcam: {
//               id: "Webcam",
//               label: "Webcam",
//               onClick: () =>
//                 self.scene.shaderGraph.setSelectedByName("WebcamInput")
//             },
//             Image: {
//               id: "Image",
//               label: "Image",
//               onClick: () =>
//                 self.scene.shaderGraph.setSelectedByName("ImageInput")
//             },
//             Text: {
//               id: "Text",
//               label: "Text",
//               onClick: () =>
//                 self.scene.shaderGraph.setSelectedByName("TextInput")
//             }
//           }
//         },
//         ...items,
//         SaveCollection: {
//           id: "SaveCollection",
//           label: "Save Collection",
//           onClick: () => {
//             self.persistShaderLibrary();
//           }
//         }
//       };
//     }
