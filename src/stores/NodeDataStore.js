import { types } from 'mobx-state-tree';

const NodeData = types
    .model("NodeData", {
        type: types.string,
        name: types.string,
        inputs: types.optional(types.array(types.string),[]),
        outputs: types.optional(types.array(types.string),["out"])
    })
    .volatile(self => ({
      ready: false
    }));

export { NodeData }