import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { ControlGroupComponent, InputFloat } from 'maco-ui';

const CounterComponent = observer((props) => {
	return (
		<ControlGroupComponent name="speed">
			{/* <fieldset>
				<legend>elapsed</legend>
				<input 
					type="number"
					value={props.value}
					readOnly	
				/>
			</fieldset> */}
			<InputFloat
				step={0.1}
				value={props.modifier}
				onChange={props.handleChange}
			/>
		</ControlGroupComponent>
	)
});

export default CounterComponent;