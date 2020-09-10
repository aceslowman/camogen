import { Graph } from './GraphStore';
import { types, getRoot, getSnapshot, applySnapshot, getParent } from "mobx-state-tree";
import { Shader } from './ShaderStore';

let shaderGraph = types
    .model("ShaderGraph", {})
    .actions(self => {
        let state_root;
        let parent_scene;

        function afterAttach() {
            state_root = getRoot(self);
            parent_scene = getParent(self);
            self.update();
        }

        /*
            afterUpdate(queue)
            TODO: maybe rename as assignTarget()?

            after graph updates, the shader graph updates targets
            and syncs the shaders with the targets

            accepts an array of nodes, ordered using either depth or
            breadth first search
        */
        function afterUpdate(queue) {
            queue.forEach(node => {
                if (node.data) {
                    if (parent_scene.targets.length && parent_scene.targets[node.branch_index]) {
                        node.data.setTarget(parent_scene.targets[node.branch_index]);
                    } else {
                        node.data.setTarget(parent_scene.addTarget());
                    }

                    node.data.target.assignShaderNode(node);

                    // move away from afterUpdate?
                    if (!node.data.ready) {                        
                        node.data.init();
                    }
                }
            });
        }

        function getShader(name) {
            let data, shader;
            
            try {
                data = state_root.shader_collection.getByName(name).data;           
                console.log(data)     
                shader = Shader.create();
                applySnapshot(shader, getSnapshot(data));
                return shader;
            } catch(err) {
                console.error('shaders have not been loaded',err)
            }
        }

        function setSelectedByName(name) {
            if(!self.selectedNode) self.selectedNode = self.root;
            console.log(self.selectedNode)
            self.selectedNode.setData(getShader(name))
            self.update(); // fixed issue where bounds weren't updating
        }
            
        return {
            afterAttach,
            afterUpdate,
            getShader,
            setSelectedByName
        }
    })


const ShaderGraph = types.compose(Graph, shaderGraph);

export { ShaderGraph }