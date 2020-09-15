import uuidv1 from 'uuid/v1';

import { types, getRoot, getParent } from "mobx-state-tree";
// import { ParameterGraph } from './GraphStore';
import Operator from '../OperatorStore';

const counter = types
    .model("Counter", {
		value: types.optional(types.union(types.number, types.string, types.boolean),0),        
		modifier: types.optional(types.union(types.number, types.string, types.boolean), 100),
	})
	.volatile(self => ({
		controls: 'something'
	}))
    .actions(self => {
		let parent_graph;
		let state_root;
		let parent_shader;

        function afterAttach() {
			state_root = getRoot(self);
			parent_graph = getParent(self,3);
			parent_shader = getParent(self,8);
			console.log(parent_graph)
			self.controls = 'hello'
			// self.controls.push(
			// 	<ControlGroupComponent>
			// 		{/* <fieldset key={this.uuid}>
			// 			<legend key={this.uuid+1}>elapsed</legend>
			// 			<input 
			// 				key={this.uuid+2}
			// 				type="number"
			// 				value={this.value}
			// 				readOnly	
			// 			/>
			// 		</fieldset> */}
			// 		<fieldset key={this.uuid+1}>
			// 			<legend key={this.uuid+1}>speed</legend>
			// 			<input 
			// 				key={this.uuid+2}
			// 				type="number"
			// 				defaultValue={this.modifier}                
			// 				onChange={this.handleChange}			
			// 			/>
			// 		</fieldset>
			// 	</ControlGroupComponent>								
			// );

			/*
				each shader is responsible for keeping
				track of it's operator graphs. 
			*/
			parent_shader.addToOperatorGroup(self)
		}
		
		function handleChange(e){
			self.modifier = Number(e.target.value);
			parent_graph.update();
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