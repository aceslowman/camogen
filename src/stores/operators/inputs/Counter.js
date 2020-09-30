import { types, getParent } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const counter = types
    .model("Counter", {
		value: types.optional(types.union(types.number, types.string, types.boolean),0),        
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 100),
	})
    .actions(self => {
		function handleChange(e){
			self.modifier = e;
		}

		function update(){
			return self.modifier !== 0 ?
				Number(self.value += (1 / self.modifier)) :
				Number(self.value);
		}

        return {
			handleChange,
			update,
        }
	})
	
const Counter = types.compose(Operator, counter)

export default Counter;