import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputFloat } from 'maco-ui';

const CounterComponent = observer((props) => {
  let {data} = props.data;   
	return (
		<ControlGroupComponent name="speed">
			<InputFloat
				step={0.1}
				value={data.modifier}
				onChange={data.handleChange}
			/>
		</ControlGroupComponent>
	)
});

export default CounterComponent;