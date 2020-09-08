import { types } from 'mobx-state-tree';

const NodeData = types
    .model("NodeData", {
        name: types.string,
        inputs: types.optional(types.array(types.string),[]),
        outputs: types.optional(types.array(types.string),["out"]),
        ready: false,
        // component_ref: null,
        // node: null,
        // controls: [],
    })
    .actions(self => {
        // let node;

        function afterAttach() {
            // node = self.parent.value;
        }

        // function onRemove() {

        // }

        return {
            afterAttach,
            // onRemove
        }
    })

export { NodeData }