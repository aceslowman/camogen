import uuidv1 from 'uuid/v1';

import { types } from "mobx-state-tree";
import { ParameterGraph } from './GraphStore';

const Parameter = types
    .model("Parameter", {
        uuid: types.identifier,
        name: types.maybe(types.string),
        value: types.maybe(types.union(types.number, types.string, types.boolean)),
        graph: types.maybe(types.late(()=>ParameterGraph))
    })
    .actions(self => {
        function afterAttach() {
            self.graph = ParameterGraph.create({uuid: uuidv1()})
        }

        function setValue(v) {
            self.value = v;
        }

        return {
            afterAttach,
            setValue
        }
    })

export default Parameter;