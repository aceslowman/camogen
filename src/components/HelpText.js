import React from 'react';
import { observer } from 'mobx-react';

const style = {
	wrapper: {
		marginTop: '15px'
	}
}

const HelpText = observer(class HelpText extends React.Component {
		
	render() {
		const store = this.props.store;

		return (
			<div style={style.wrapper}>
				{store.helpText}
			</div>
		);
	}
});

export default HelpText;