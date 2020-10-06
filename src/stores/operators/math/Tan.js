import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const tan = types
	.model("Tan", {
		value: 0,
		modifier: 0,
		inputs: types.optional(types.array(types.string), ["input1"])
	})
	.actions(self => ({
		update: () => {
			if (!self.parents[0] || !self.parents[0].data) return 0

			let a = self.parents[0].data.update();
			self.value = Math.tan(a)
			return self.value;
		}
	}))

const Tan = types.compose(Operator, tan).named("Tan")

export default Tan;