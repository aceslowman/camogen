import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const multiply = types
	.model("Multiply", {
		value: types.optional(types.union(types.number, types.string, types.boolean), 0),
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 1),
		inputs: types.optional(types.array(types.string), ["input1", "input2"])
	})
	.actions(self => ({
		update: () => {
			let a = self.parents[0].data.update();
			let b = (self.parents[1] && self.parents[1].data) ? self.parents[1].data.update() : self.modifier;
			return a * b;
		}
	}))

const Multiply = types.compose(Operator, multiply).named("Multiply")

export default Multiply;