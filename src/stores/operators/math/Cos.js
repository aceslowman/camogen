import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const cos = types
	.model("Cos", {
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 0),
	})
	.actions(self => ({
		update: () => {
			let a = self.parents[0].data.update();
			return Math.cos(a);
		}
	}))

const Cos = types.compose(Operator, cos).named("Cos")

export default Cos;