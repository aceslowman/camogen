import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class AddStore extends OperatorStore{
	@observable name 	  = "Add";
	@observable value 	  = 0;
	@observable modifier  = 0;
	
	constructor(p, mod = 5) {	
		super(p, mod);
	}

	@action update = (v) => {		
        return Number(v) + Number(this.modifier);
	}
}

createModelSchema(store, {
	extends: OperatorStore
});

export default store;