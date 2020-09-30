import Graph from './GraphStore';
import { types, getRoot, getSnapshot, applySnapshot, getParent } from "mobx-state-tree";
import Shader from './ShaderStore';

let shaderGraph = types
    .model("ShaderGraph", {})
    .actions(self => {
        let state_root;
        let parent_scene;

        function afterAttach() {
            state_root = getRoot(self);
            parent_scene = getParent(self);
        }

        /*
            afterUpdate(queue)

            after graph updates, the shader graph updates targets
            and syncs the shaders with the targets

            accepts an array of arrays, representing each target and it's 
            render queue.
        */
        function afterUpdate() {
            self.queue.forEach((subqueue, branch_id) => {

                /*
                    assign targets to shaders

                    note: seems like there is room for refactoring and making
                    the logic of this clearer.
                */
                subqueue.forEach((node) => {
                    if (node.data) {
                        // if there are targets and the necessary one is available
                        if (parent_scene.targets.length && parent_scene.targets[node.branch_index]) {
                            node.data.setTarget(parent_scene.targets[node.branch_index]);
                        } else { // otherwise, add target
                            node.data.setTarget(parent_scene.addTarget());
                        }

                        if (!node.data.ready) {
                            node.data.init();
                        }
                    }
                });  
                
                // if target exists, assign full queue
                if(parent_scene.targets[branch_id])
                    parent_scene.targets[branch_id].setRenderQueue(subqueue);
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
            self.selectedNode.setData(getShader(name));
            self.update(); // fixed issue where bounds weren't updating
        }
            
        return {
            afterAttach,
            afterUpdate,
            getShader,
            setSelectedByName
        }
    })


const ShaderGraph = types.compose('Shader Graph', Graph, shaderGraph);

export default ShaderGraph;