import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputFloat } from 'maco-ui';

const FloatComponent = observer((props) => {
  let {data} = props.data; 
	return (
		<ControlGroupComponent name="value">
			<InputFloat
				step={0.1}
				value={data.value}
				onChange={data.handleChange}
			/>
		</ControlGroupComponent>
	)
});

export default FloatComponent;