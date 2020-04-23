import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';

//----------------------------------------------------------------------
const store = class ElapsedTimeStore extends OperatorStore{
	name  = "ElapsedTime";
	value = 0;

	update = () => {
		return Number(this.value++);
	}
}

decorate(store, {
	name: observable,
	value: observable,
	update: action,		
});

export default store;