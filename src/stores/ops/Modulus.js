import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class ModulusStore extends OperatorStore {
	name = "Modulus";
    value = 0;
	modifier = 1;
	
	constructor(p, v = 1) {
		super(p, v);
		this.modifier = v;
	}

	update = (v) => {		
        return Number(v) % Number(this.modifier);
	}
}

decorate(store, {
	name: observable,
    value: observable,
    modifier: observable,
	update: action,		
});

createModelSchema(store, {
	extends: OperatorStore
});

export default store;