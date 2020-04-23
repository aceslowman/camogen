import { observable, action, decorate } from 'mobx';

//----------------------------------------------------------------------
const store = class SubtractStore {
	name = "Subtract";
    value = 0;
	modifier = 1;
	
	constructor(v) {
		this.modifier = v;
	}

	update(v) {		
        return Number(v) - Number(this.modifier);
	}
}

decorate(store, {
	name: observable,
    value: observable,
    modifier: observable,
	update: action,		
});

export default store;