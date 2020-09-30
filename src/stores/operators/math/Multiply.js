import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class MultiplyStore extends OperatorStore{
	@observable name = "Multiply";
    @observable value = 0;
	@observable modifier = 1;
	
	constructor(p, mod = 1) {
		super(p, mod);
	}

	@action update = (v) => {		
        return Number(v) * Number(this.modifier);
	}
}

createModelSchema(store, {
	extends: OperatorStore
});

export default store;