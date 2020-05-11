import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class ElapsedTimeStore extends OperatorStore {
	name  = "ElapsedTime";
	value = 0;

	init = () => {	
		setInterval(() => {
			this.value = this.update();
			this.parent.update();
		}, 30);

		return this;
	}

	update = () => {
		return Number(this.value++);
	}
}

decorate(store, {
	name:   observable,
	value:  observable,
	update: action,		
	init:   action
});

createModelSchema(store, {
	extends: OperatorStore
});

export default store;