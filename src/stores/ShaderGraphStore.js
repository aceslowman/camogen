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

            after graph updates, the shader graph updates targets
            and syncs the shaders with the targets

            accepts an array of nodes, ordered using either depth or
            breadth first search
        */
        function afterUpdate(queue) {
            console.log(parent_scene)

            queue.forEach((subqueue,branch_id) => {

                /*
                    TODO: I bet I could refactor this forEach out of here
                */
                subqueue.forEach((node, i) => {
                    if (node.data) {
                        // if there are targets and the necessary one is available
                        if (parent_scene.targets.length && parent_scene.targets[node.branch_index]) {
                            node.data.setTarget(parent_scene.targets[node.branch_index]);
                        } else { // otherwise, add target
                            node.data.setTarget(parent_scene.addTarget());
                        }

                        // move away from afterUpdate?
                        if (!node.data.ready) {
                            node.data.init();
                        }
                    }
                });  
                
                // if target exists, assign full queue
                if(parent_scene.targets[branch_id])
                    parent_scene.targets[branch_id].assignRenderQueue(subqueue);
            });
        }

        function getShader(name) {
            let data, shader;
            
            try {
                data = state_root.shader_collection.getByName(name).data;           
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