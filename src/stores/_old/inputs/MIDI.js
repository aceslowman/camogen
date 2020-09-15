import React from 'react';
import { observable, action } from 'mobx';
import OperatorStore from '../OperatorStore';
import {createModelSchema} from "serializr";

import {
	ControlGroupComponent,
} from 'maco-ui';

//----------------------------------------------------------------------
export default class MIDIStore extends OperatorStore {
	@observable name     = "MIDI";
	@observable modifier = 127;
	@observable value 	 = 0;

	@observable activeInput = null;
	@observable activeChannel = null;
	
	constructor(parent, mod = 127) {
		super(parent, mod)		
		navigator.requestMIDIAccess().then(this.onMIDIConnect);
	}

	@action init = () => {
		return this;
	}

	@action onMIDIConnect = (access) => {
		this.MIDIInputs = [...access.inputs.values()];

		this.controls.push(
			<ControlGroupComponent name="MIDI Settings">
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
			</ControlGroupComponent>								
		);
		
		access.onstatechange = function (e) {
			// Print information about the (dis)connected MIDI controller
			console.log(e.port.name, e.port.manufacturer, e.port.state);
		};
	}

	@action handleMIDIChange = (v) => {
		if(this.activeChannel === null) this.activeChannel = v.data[1];
		if(this.activeChannel === v.data[1]){
			this.value = Number(v.data[2]);
			this.parent.parent.graph.update();
		}
	}

	@action update = () => {
		return this.value / this.modifier
	}

	@action handleInputSelect = (e) => {
		this.MIDIInputs.forEach(input=>{			
			if (input.name === e.target.value) {
				this.activeInput = input;
				this.activeInput.onmidimessage = this.handleMIDIChange;
				return;
			}				
		});
	}
}

createModelSchema(MIDIStore, {
	extends: OperatorStore
});
