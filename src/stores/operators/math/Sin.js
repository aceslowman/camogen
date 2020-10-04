import {
    types,
    getParent
} from "mobx-state-tree";
import Operator from '../../OperatorStore';

const sin = types
    .model("Sin", {
        value: types.optional(types.union(types.number, types.string, types.boolean), 0),
        modifier: types.optional(types.union(types.number, types.string, types.boolean), 0),
        inputs: types.optional(types.array(types.string), ["input1"])
    })
    .actions(self => {
        let parent_node;

        function afterAttach() {
            parent_node = getParent(self);
        }

        function update() {
            if(!parent_node.parents[0] || !parent_node.parents[0].data) return 0
            let a = parent_node.parents[0].data.value;
            return Math.sin(a);
        }

        return {
            afterAttach,
            update,
        }
    })

const Sin = types.compose(Operator, sin).named("Sin")

export default Sin;