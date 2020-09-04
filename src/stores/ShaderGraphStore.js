import { Graph } from './GraphStore';
import { types } from "mobx-state-tree";

let shaderGraph = types
    .model("ShaderGraph", {
        
    })
    .actions(self => {
            
        return {
            
        }
    })


const ShaderGraph = types.compose(Graph, shaderGraph);

export { ShaderGraph }