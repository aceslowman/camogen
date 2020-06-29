// // import React from 'react';
import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr";

//----------------------------------------------------------------------
export default class CounterStore extends OperatorStore {
	@observable name  	 = "Counter";
	@observable modifier = 100;
	@observable value 	 = 0;

	constructor(parent, mod=100) {
		super(parent,mod)
	}

	@action init = () => {		
		let graph = this.node;
		let param = graph.parent;
		let uniform = param.parent;
		let shader = uniform.parent;
		
		shader.operatorUpdateGroup.push(this)

		return this;
	}

	@action update = () => {
		return this.modifier !== 0 
			? Number(this.value += (1 / this.modifier)) 
			: Number(this.value);
	}
}

createModelSchema(CounterStore, {
	extends: OperatorStore
});