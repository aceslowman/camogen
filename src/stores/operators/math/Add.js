import { types, getParent } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const add = types
	.model("Add", {
		value: types.optional(types.union(types.number, types.string, types.boolean), 0),
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 0),
		inputs: types.optional(types.array(types.string), ["input1", "input2"])
	})
	.actions(self => {
		let parent_node;

		function afterAttach() {
			parent_node = getParent(self);
		}

		function handleChange(e) {
			self.modifier = e;
			if (parent_node.parents.length > 1) console.log('inputs', parent_node.parents)
		}

		function update() {
			let a = parent_node.parents[0].data.value;
			let b = (parent_node.parents[1] && parent_node.parents[1].data) ? parent_node.parents[1].data.value : 0;
			return a + b;
		}

		return {
			afterAttach,
			handleChange,
			update,
		}
	})

const Add = types.compose(Operator, add)

export default Add;