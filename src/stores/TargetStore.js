import { types, getRoot } from "mobx-state-tree";
import { GraphNode } from './NodeStore';

const Target = types
    .model("Target", {
        uuid: types.identifier,
        ref: types.custom({
            name: 'p5 target reference',
            fromSnapshot: () => undefined,
            toSnapshot: () => undefined,
            isTargetType: () => true,
        }),
        shader_nodes: types.array(types.reference(types.late(()=>GraphNode)))
    })
    .actions(self => {
        let root_store; 

        function afterAttach() {
            root_store = getRoot(self);

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

        function assignShaderNode(shader) {
            if (self.shader_nodes.includes(shader)) {
                // console.log(shader.name + ' can be recycled')

            } else {
                // console.log(shader.name + ' CANT be recycled')
                self.shader_nodes.push(shader);
            }
        }

        function removeShaderNode(shader) {
            console.log(shader)
            self.shader_nodes = self.shader_nodes.filter((item) => item.uuid !== shader.uuid);

            // if (this.shader_nodes.length === 0) this.parent.removeTarget(this);
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