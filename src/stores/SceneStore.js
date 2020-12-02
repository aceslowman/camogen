import uuidv1 from 'uuid/v1';

import { getSnapshot, types } from "mobx-state-tree";
import ShaderGraph from './ShaderGraphStore';
import Target from './TargetStore';
import { OperatorGraph } from './GraphStore';
// import OperatorGraph from './OperatorGraphStore';

const Scene = types
    .model("Scene", {
        shaderGraph: types.maybe(ShaderGraph),
        operatorGraphs: types.map(OperatorGraph),
        targets: types.array(Target)
    })
    // .volatile(self => ({
    //     clock: 0
    // }))
    .actions(self => {
        function afterAttach() {   
            self.shaderGraph = ShaderGraph.create({uuid: uuidv1()});

            /*
                add uv shader by default

                likely to be replaced with
                single loaded snapshot in RootScene
            */
            self.shaderGraph.addNode();
            self.shaderGraph.setSelectedByName('Text');
            self.shaderGraph.root.select();
            // self.shaderGraph.setSelectedByName('Glyph')
            
            self.shaderGraph.update();
        }

        function addTarget(target = Target.create()) {
            self.targets.push(target);
            return target;
        }

        function addOperatorGraph(param) {
            return self.operatorGraphs.put(
                OperatorGraph.create({
                    uuid: 'opgraph_' + uuidv1(),
                    param: param
                })
            );
        }

        function removeTarget(target) {
            self.targets = self.targets.filter((item) => item !== target);
        }

        function clear() {
            self.shaderGraph.clear();   
               
            self.targets = [];

            /* 
                TODO: !!! this is returning an error! this persistently
                does not clear properly (maybe a type issue in mst?)

                it seems *safe enough* to bypass this error, it doesn't
                break the scene, but this needs to be fixed.

                can confirm that all nodes do delete
            */
            // try {
                self.operatorGraphs.forEach(e => {
                    e.clear();
                })
                console.log(getSnapshot(self.operatorGraphs))
                self.operatorGraphs.clear()
            // } catch(error) {
            //     console.warn('camogen is still having issues with clearing scenes!',error)
            // }
        }

        return {
            afterAttach,
            addTarget,
            addOperatorGraph,
            removeTarget,
            clear,
        };
    })

export default Scene;