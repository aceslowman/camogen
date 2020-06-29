import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
export default class AddStore extends OperatorStore {
	@observable name 	  = "Add";
	@observable value 	  = 0;
	@observable modifier  = 0;
	@observable inputs 	  = ["input1","input2"];
	
	constructor(parent, mod = 5) {	
		super(parent, mod);
	}

	@action init = () => {
		let graph = this.node;
		let param = graph.parent;
		let uniform = param.parent;
		let shader = uniform.parent;

		shader.operatorUpdateGroup.push(this)

		return this;
	}

	@action update = (v) => {		
        return Number(v) + Number(this.modifier);
	}
}

createModelSchema(AddStore, {
	extends: OperatorStore
});