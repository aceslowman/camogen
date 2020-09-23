import { types } from 'mobx-state-tree';

const NodeData = types
    .model("NodeData", {
        name: types.string,
        inputs: types.optional(types.array(types.string),[]),
        outputs: types.optional(types.array(types.string),["out"]),
        ready: false,
    });

export { NodeData }