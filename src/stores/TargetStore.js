import { types, getRoot, getParent } from "mobx-state-tree";
import { GraphNode } from './NodeStore';

const Target = types
    .model("Target", {
        uuid: types.identifier,
        shader_nodes: types.array(types.safeReference(types.late(()=>GraphNode)))
    })
    .volatile(self => ({
        ref: null
    }))
    .actions(self => {
        let root_store; 
        let parent_scene;

        function afterAttach() {
            root_store = getRoot(self);
            parent_scene = getParent(self,2);
            setupRef();
        }

        function setupRef() {
            let p = root_store.p5_instance;
            
            self.ref = p.createGraphics(
                p.width,
                p.height,
                p.WEBGL
            );
        }

        function clear() {
            self.shader_nodes = [];
        }

        // // this method is responsible for order
        // function assignShaderNode(node,idx,largest_idx) {
        //     self.shader_nodes = self.shader_nodes.slice(0,largest_idx);

        //     if(idx < self.shader_nodes.length-1) {
        //         self.shader_nodes[idx] = node;
        //     } else if(!self.shader_nodes.includes(node)){
        //         self.shader_nodes.push(node);
        //     }                   
        // }

        function assignRenderQueue(queue) {
            console.log(queue.filter(e => e.uuid))
            self.shader_nodes = queue.filter(e=>e.uuid);
            console.log(self.shader_nodes)
        }

        function removeShaderNode(shader) {
            self.shader_nodes = self.shader_nodes.filter((item) => item.uuid !== shader.uuid);

            if (self.shader_nodes.length === 0) parent_scene.removeTarget(self);
        }

        return {
            setupRef,
            afterAttach,
            clear,
            assignRenderQueue,
            // assignShaderNode,
            removeShaderNode,
        };
    })

export { Target }