import { Graph } from './GraphStore';
import { types, getRoot, getSnapshot, applySnapshot } from "mobx-state-tree";
import { Shader } from './ShaderStore';
import { undoManager } from '../RootStore';
// import { Shader } from './ShaderStore';

let shaderGraph = types
    .model("ShaderGraph", {
    })
    .actions(self => {
        let state_root;

        function afterAttach() {
            state_root = getRoot(self);
        }

        function getShader(name) {
            let data, shader;
            
            try {
                data = state_root.shader_collection.getByName(name).data;                
                shader = Shader.create({});
                applySnapshot(shader, getSnapshot(data));
                return shader;
            } catch(err) {
                console.error('shaders have not been loaded',err)
            }
        }

        function setSelectedByName(name) {
            self.selectedNode.setData(getShader(name))
        }
            
        return {
            // afterAttach: () => undoManager.withoutUndo(afterAttach),
            // getShader: () => undoManager.withoutUndo(getShader),
            afterAttach,
            getShader,
            setSelectedByName
        }
    })


const ShaderGraph = types.compose(Graph, shaderGraph);

export { ShaderGraph }