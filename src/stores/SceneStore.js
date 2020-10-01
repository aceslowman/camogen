import uuidv1 from 'uuid/v1';

import { types } from "mobx-state-tree";
import ShaderGraph from './ShaderGraphStore';
import Target from './TargetStore';

const Scene = types
    .model("Scene", {
        shaderGraph: types.maybe(ShaderGraph),
        targets: types.array(Target)
    })
    .actions(self => {
        function afterAttach() {   
            self.shaderGraph = ShaderGraph.create({uuid: uuidv1()});

            /*
                add uv shader by default

                likely to be replaced with
                single loaded snapshot in RootScene
            */
            self.shaderGraph.addNode();
            self.shaderGraph.setSelectedByName('UV');
            self.shaderGraph.root.select();
            self.shaderGraph.setSelectedByName('Glyph')
            
            // self.shaderGraph.update();
        }

        function addTarget(target = Target.create()) {
            self.targets.push(target);
            return target;
        }

        function removeTarget(target) {
            self.targets = self.targets.filter((item) => item !== target);
        }

        function clear() {
            console.log('clearing scene!')
            // TODO: issue here with clearing a scene containing subgraphs
            self.shaderGraph.clear();       
            self.targets = [];
        }

        return {
            afterAttach,
            addTarget,
            removeTarget,
            clear,
        };
    })

export default Scene;