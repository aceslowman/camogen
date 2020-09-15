import { NodeData } from './NodeDataStore';
import { types } from "mobx-state-tree";

let operator = types
    .model("Operator", {
        uuid: types.identifier,
        value: types.maybe(types.union(types.number, types.string, types.boolean)),
        modifier: types.maybe(types.union(types.number, types.string, types.boolean)),
    })

const Operator = types.compose("Operator", NodeData, operator);

export default Operator;