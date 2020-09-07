import uuidv1 from 'uuid/v1';

import { types, getSnapshot } from "mobx-state-tree";
import { ShaderGraph } from './ShaderGraphStore';
import { Target } from './TargetStore';
import { GraphNode } from './NodeStore';

const Scene = types
    .model("Scene", {
        shaderGraph: types.maybe(ShaderGraph),
        targets: types.array(Target)
    })
    .actions(self => {
        function afterAttach() {   
            console.log(getSnapshot(self))
            self.shaderGraph = ShaderGraph.create({uuid:uuidv1()})
            
            // let uv = self.shaderGraph.getShader('UV');
            // self.shaderGraph.root.setData(uv);

            // setTimeout(() => self.shaderGraph.appendNode(GraphNode.create({uuid: 'append_'+uuidv1(), name: 'node A'})), 1000)
            // setTimeout(() => self.shaderGraph.appendNode(GraphNode.create({uuid: 'append_'+uuidv1(), name: 'node B'})), 2000)
            // setTimeout(() => self.shaderGraph.appendNode(GraphNode.create({uuid: 'append_'+uuidv1(), name: 'node C'})), 3000)            
        }

        function clear() {
            self.shaderGraph.clear();
        }

        return {
            afterAttach,
            clear,
        };
    })

export { Scene }