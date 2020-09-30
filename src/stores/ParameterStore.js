import uuidv1 from 'uuid/v1';

import { getParent, types } from "mobx-state-tree";
import { ParameterGraph } from './GraphStore';

const Parameter = types
    .model("Parameter", {
        uuid: types.identifier,
        name: types.maybe(types.string),
        value: types.optional(types.union(types.number, types.string, types.boolean),0),
        graph: types.maybe(types.late(()=>ParameterGraph)),
        controlType: types.maybe(types.string)
    })
    .actions(self => {
        function createGraph() {
            self.graph = ParameterGraph.create({uuid: uuidv1()})
            self.graph.root.select();
        }

        function setValue(v) {
            self.value = v;
        }

        function beforeDestroy() {
            // console.log('hit destroy')
            // if(self.graph) self.graph.clear();
        }

        return {
            createGraph,
            setValue,
            beforeDestroy
        }
    })

export default Parameter;