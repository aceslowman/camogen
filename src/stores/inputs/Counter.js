import React from 'react';
import ControlGroupComponent from '../../components/ControlGroupComponent';
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

		this.controls.push(
			<ControlGroupComponent>
				{/* <fieldset key={this.uuid}>
					<legend key={this.uuid+1}>elapsed</legend>
					<input 
						key={this.uuid+2}
						type="number"
						value={this.value}
						readOnly	
					/>
				</fieldset> */}
				<fieldset key={this.uuid+1}>
					<legend key={this.uuid+1}>speed</legend>
					<input 
						key={this.uuid+2}
						type="number"
						defaultValue={this.modifier}                
						onChange={this.handleChange}			
					/>
				</fieldset>
			</ControlGroupComponent>								
		);

		// NOTE: if the operators stop moving, it 
		// may be because init() was not called.
		this.init()
	}

	@action handleChange = e => {
		this.modifier = Number(e.target.value);
		this.node.graph.update();
	}

	@action init = () => {		
		let graph = this.node;
		let param = graph.parent;
		let uniform = param.parent;
		let shader = uniform.parent;
		
		/*
			each shader is responsible for keeping
			track of it's operator graphs. 
		*/
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