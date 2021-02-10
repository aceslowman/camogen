import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputBool, InputSelect } from 'maco-ui';

const MIDIComponent = observer((props) => {	
  let {data} = props.data; 
	return (
		<React.Fragment>
			<ControlGroupComponent name="MIDI Settings">
				<InputSelect
					options={data.midi_inputs.map((e,i)=>(
						{
							label: e.name, 
							value: e.name
						}
					))}
					onChange={data.handleInputSelect}
				/>
			</ControlGroupComponent>
			<ControlGroupComponent name="normalize (0-1)">
				<InputBool
					checked={data.modifier === 127}
					onChange={(e)=>{
						data.setModifier(e ? 127 : 1)
					}}
				/>
			</ControlGroupComponent>
		</React.Fragment>										
	);	
});

export default MIDIComponent;