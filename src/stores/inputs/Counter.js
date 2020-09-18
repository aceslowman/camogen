import { types, getParent } from "mobx-state-tree";
import Operator from '../OperatorStore';

const counter = types
    .model("Counter", {
		value: types.optional(types.union(types.number, types.string, types.boolean),0),        
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 100),
	})
    .actions(self => {
		let parent_graph;
		let parent_shader;

        function afterAttach() {
			parent_graph = getParent(self,3);
			parent_shader = getParent(self,8);

			/*
				each shader is responsible for keeping
				track of it's operator graphs. 
			*/
			parent_shader.addToOperatorGroup(self)
		}
		
		function handleChange(e){
			self.modifier = e;
		}

		function update(){
			return self.modifier !== 0 ?
				Number(self.value += (1 / self.modifier)) :
				Number(self.value);
		}

		function recalculateParent() {
			parent_graph.update();
		}

        return {
			afterAttach,
			handleChange,
			update,
			recalculateParent
        }
	})
	
const Counter = types.compose(Operator, counter)

export default Counter;