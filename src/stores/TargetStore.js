import { types, getRoot, getParent } from "mobx-state-tree";
import { GraphNode } from './NodeStore';

const Target = types
    .model("Target", {
        uuid: types.identifier,
        // ref: types.custom({
        //     name: 'p5 target',
        //     fromSnapshot: () => undefined,
        //     toSnapshot: () => undefined,
        //     isTargetType: () => true,
        // }),
        shader_nodes: types.array(types.safeReference(types.late(()=>GraphNode)))
    })
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

        // this method is responsible for order
        function assignShaderNode(shader) {
            // console.log(shader)
            if (self.shader_nodes.includes(shader)) {
                // console.log(shader.name + ' can be recycled')

            } else {
                // console.log(shader.name + ' CANT be recycled')
                self.shader_nodes.push(shader);
            }
        }

        function removeShaderNode(shader) {
            self.shader_nodes = self.shader_nodes.filter((item) => item.uuid !== shader.uuid);

            if (self.shader_nodes.length === 0) parent_scene.removeTarget(self);
        }

        return {
            setupRef,
            afterAttach,
            clear,
            assignShaderNode,
            removeShaderNode,
        };
    })

export { Target }