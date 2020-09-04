import uuidv1 from 'uuid/v1';

import { types, getSnapshot } from "mobx-state-tree";
import { ShaderGraph } from './ShaderGraphStore';
import { Target } from './TargetStore';

const Scene = types
    .model("Scene", {
        shaderGraph: types.maybe(ShaderGraph),
        targets: types.array(Target)
    })
    .actions(self => {
        function afterCreate() {   
            self.shaderGraph = ShaderGraph.create({uuid:uuidv1()})
            
            // self.shaderGraph.appendNode();

            setTimeout(() => self.shaderGraph.appendNode(), 1000)
            setTimeout(() => self.shaderGraph.appendNode(), 2000)
            setTimeout(() => self.shaderGraph.appendNode(), 3000)
            
            // console.log(getSnapshot(self.shaderGraph))
        }

        return {
            afterCreate,
        };
    })

export { Scene }