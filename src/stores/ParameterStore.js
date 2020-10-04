import uuidv1 from 'uuid/v1';

import { getParent, getSnapshot, types } from "mobx-state-tree";
import { ParameterGraph } from './GraphStore';
// import ParameterGraph from './ParameterGraphStore';

const Parameter = types
    .model("Parameter", {
        uuid: types.identifier,
        name: types.maybe(types.string),
        value: types.optional(types.union(types.number, types.string, types.boolean),0),
        graph: types.maybe(types.safeReference(types.late(()=>ParameterGraph))),
        controlType: types.maybe(types.string)
    })
    .actions(self => {
        function createGraph() {
            let parent_shader = getParent(self, 4);

            // TODO: should be toggleable
            self.graph = parent_shader.addToParameterUpdateGroup(
                ParameterGraph.create({
                    uuid: 'paramgraph_' + uuidv1(),
                    parent_param: self
                })
            )

            self.graph.root.select(); 
        }

        function setValue(v) {
            self.value = v;
        }

        function beforeDestroy() {
            console.log('hit destroy', getSnapshot(self))
            // if(self.graph) self.graph.clear();
        }

        return {
            createGraph,
            setValue,
            beforeDestroy
        }
    })

export default Parameter;