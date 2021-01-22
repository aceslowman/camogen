import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputFloat } from 'maco-ui';

const FloatComponent = observer((props) => {
	return (
		<ControlGroupComponent name="value">
			<InputFloat
				step={0.1}
				value={props.data.value}
				onChange={props.data.handleChange}
			/>
		</ControlGroupComponent>
	)
});

export default FloatComponent;