import React from 'react';
import { observer } from 'mobx-react';

const HelpText = observer(class HelpText extends React.Component {
		
	render() {
		const store = this.props.store;

		return (
			<div>
				{store.helpText}
			</div>
		);
	}
});

export default HelpText;