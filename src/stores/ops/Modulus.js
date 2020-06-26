import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class ModulusStore extends OperatorStore {
	@observable name = "Modulus";
    @observable value = 0;
	@observable modifier = 1;
	
	constructor(p, v = 1) {
		super(p, v);
		this.modifier = v;
	}

	@action update = (v) => {		
        return Number(v) % Number(this.modifier);
	}
}

createModelSchema(store, {
	extends: OperatorStore
});

export default store;