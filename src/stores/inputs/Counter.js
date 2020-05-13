import React from 'react';
import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class CounterStore extends OperatorStore {
	name  	 = "Counter";
	modifier = 100;
	value 	 = 0;

	constructor(p, mod=100) {
		super(p,mod)
	}

	init = () => {			
		let graph = this.parent;
		let param = graph.parent;
		let uniform = param.parent;
		let shader = uniform.parent;
		
		shader.operatorUpdateGroup.push(this)

		return this;
	}

	update = () => {
		return this.modifier !== 0 
			? Number(this.value += (1 / this.modifier)) 
			: Number(this.value);
	}
}

decorate(store, {
	name:   observable,
	value:  observable,
	modifier: observable,
	update: action,		
	init:   action
});

createModelSchema(store, {
	extends: OperatorStore
});

export default store;