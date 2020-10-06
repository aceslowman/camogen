import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const counter = types
    .model("Counter", {
		value: 0,        
		modifier: 100,
	})
    .actions(self => ({
		update: () => {
			self.value = self.modifier !== 0 ?
				self.value += 1 / self.modifier : self.value;
			return self.value;
		}
	}))
	
const Counter = types.compose(Operator, counter)

export default Counter;