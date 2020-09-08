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
        function afterAttach() {   
            self.shaderGraph = ShaderGraph.create({uuid: uuidv1()})
        }

        function addTarget(target = Target.create({uuid: 'target_'+uuidv1()})) {
            self.targets.push(target);
            return target;
        }

        function clear() {
            self.shaderGraph.clear();
        }

        return {
            afterAttach,
            addTarget,
            clear,
        };
    })

export { Scene }