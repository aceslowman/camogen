import React from 'react';
import { observable, action, decorate } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr"

//----------------------------------------------------------------------
const store = class MIDIStore extends OperatorStore {
	name     = "MIDI";
	modifier = 127;
	value 	 = 0;
	inputs   = null;
	activeInput = null;
	activeChannel = null;
	
	constructor(p, mod = 127) {
		super(p, mod)		
		navigator.requestMIDIAccess().then(this.onMIDIConnect);
	}

	onMIDIConnect = (access) => {
		this.MIDIInputs = [...access.inputs.values()];

		this.inputs = (
			<React.Fragment>
				<fieldset key={this.uuid}>
					<label key={this.uuid+1}>MIDI Device</label>
					<select key={this.uuid+2} onChange={this.handleInputSelect}>
						{this.MIDIInputs.map((e,i)=>{
							return (<option key={i} value={e.name}>{e.name}</option>);
						})}						
					</select>					
				</fieldset>
				<fieldset key={this.uuid+1}>
					<label key={this.uuid+1}>(0-1)</label>
					<input 
						key={this.uuid+2}
						type="checkbox"
						defaultChecked={this.modifier === 127}                
						onChange={(e)=>{
							this.modifier = e.target.checked ? 127 : 1
						}}			
					/>
				</fieldset>
				{/* <div key={this.uuid+1}>{this.activeChannel}</div> */}
			</React.Fragment>								
		)
		
		access.onstatechange = function (e) {
			// Print information about the (dis)connected MIDI controller
			console.log(e.port.name, e.port.manufacturer, e.port.state);
		};
	}

	handleMIDIChange = (v) => {
		if(this.activeChannel === null) this.activeChannel = v.data[1];
		if(this.activeChannel === v.data[1]){
			this.value = Number(v.data[2]);
			this.parent.parent.graph.update();
		}
	}

	update = () => {
		return this.value / this.modifier
	}

	handleInputSelect = (e) => {
		this.MIDIInputs.forEach(input=>{			
			if (input.name === e.target.value) {
				this.activeInput = input;
				this.activeInput.onmidimessage = this.handleMIDIChange;
				return;
			}				
		});
	}
}

decorate(store, {
	name:          observable,
	value:         observable,
	modifier: 	   observable,
	inputs:        observable,
	activeChannel: observable,
	update:        action,	
	onMIDIConnect: action,
	handleInputSelect: action,
	handleMIDIChange: action,
	init:          action
});

createModelSchema(store, {
	extends: OperatorStore
});

export default store;