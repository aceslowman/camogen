import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class DivideStore extends OperatorStore{
	@observable name = "Divide";
	@observable value = 0;
	@observable modifier = 0;

	@action update = (v) => {		
        return Number(v) / Number(this.modifier);
	}
}

createModelSchema(store, {
	extends: OperatorStore
});

export default store;