import { types, getRoot, getParent } from "mobx-state-tree";
import GraphNode from './NodeStore';
import {undoManager} from "./GraphStore";

const Target = types
    .model("Target", {
        render_queue: types.array(types.safeReference(types.late(()=>GraphNode)))     
    })
    .volatile(() => ({
        ref: null
    }))
    .actions(self => ({
        afterAttach: () => {
            root_store = getRoot(self);
            parent_scene = getParent(self,2);
            
            let p = root_store.p5_instance;

            self.ref = p.createGraphics(
                p.width,
                p.height,
                p.WEBGL
            );
        },

        clear: () => {
            self.render_queue = [];
        },

        setRenderQueue: (queue) => {
            self.render_queue = queue;
        }

        removeShaderNode(shader) => {
            self.render_queue = self.render_queue.filter((item) => item.uuid !== shader.uuid);

            if (self.render_queue.length === 0) parent_scene.removeTarget(self);
        }

        // return {
        //     // afterAttach,
        //     afterAttach: () => undoManager.withoutUndo(()=>afterAttach()),
        //     // clear,
        //     clear: () => undoManager.withoutUndo(()=>clear()),
        //     setRenderQueue,
        //     // setRenderQueue: (q) => undoManager.withoutUndo(()=>setRenderQueue(q)),
        //     removeShaderNode,
        //     // removeShaderNode: (n) => undoManager.withoutUndo(()=>removeShaderNode(n)),
        // };
    })

export default Target;