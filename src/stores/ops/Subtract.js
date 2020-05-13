import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class SubtractStore extends OperatorStore{
	name = "Subtract";
    value = 0;
	modifier = 1;
	
	constructor(p, mod = 0) {
		super(p, mod);
	}

	update = (v) => {		
        return Number(v) - Number(this.modifier);
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