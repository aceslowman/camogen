import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const add = types
	.model("Add", {
		modifier: 0,
		value: 0,
		inputs: types.optional(types.array(types.string), ["input1", "input2"])
	})
	.actions(self => ({
		update: () => {
			let a = self.parents[0].data.update();
			let b = (self.parents[1] && self.parents[1].data) ? self.parents[1].data.update() : self.modifier;
			self.value = a + b
			return self.value;
		}
	}))

const Add = types.compose(Operator, add).named("Add")

export default Add;