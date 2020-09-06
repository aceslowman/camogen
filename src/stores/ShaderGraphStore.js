import { Graph } from './GraphStore';
import { types, getRoot, getSnapshot } from "mobx-state-tree";

let shaderGraph = types
    .model("ShaderGraph", {
        
    })
    .actions(self => {
        let state_root;

        function afterAttach() {
            state_root = getRoot(self);
        }

        function getShader(name) {
            console.log('getting ', getSnapshot(state_root))

            let shader = state_root.shader_collection.getByName(name);
                    
            
            return shader
            // first, check built-in inputs
            // for (let key in this.mainStore.input_list) {
            //     let item = this.mainStore.input_list[key];

            //     if (key === name) {
            //         result = item;
            //         break;
            //     }
            // }

            // if (result) return new result();

            // // and check custom-shaders. matches will override built-in inputs
            // for (let key in this.mainStore.shader_list) {
            //     let item = this.mainStore.shader_list[key];

            //     if (item._isDirectory) {
            //         for (let subkey of Object.keys(item)) {
            //             if (subkey === '_isDirectory') continue;
            //             let subItem = item[subkey]

            //             if (subItem.name === name) {
            //                 result = subItem.name === name ? subItem : null;
            //                 break;
            //             }
            //         }
            //     } else {
            //         if (key === name) {
            //             result = item;
            //             break;
            //         }
            //     }
            // }

            // if (result) {
            //     return deserialize(ShaderStore.schema, result);
            // } else {
            //     console.error(`couldn't find shader named '${name}'`);
            //     return null;
            // }
        }
            
        return {
            afterAttach,
            getShader
        }
    })


const ShaderGraph = types.compose(Graph, shaderGraph);

export { ShaderGraph }