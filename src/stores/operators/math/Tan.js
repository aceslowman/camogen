import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const tan = types
	.model("Tan", {
		value: types.optional(types.union(types.number, types.string, types.boolean), 0),
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 0),
	})
	.actions(self => ({
		update: () => {
			let a = self.parents[0].data.update();
			return Math.tan(a);
		}
	}))

const Tan = types.compose(Operator, tan).named("Tan")

export default Tan;