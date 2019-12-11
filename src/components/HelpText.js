import React from 'react';
import { observer } from 'mobx-react';

const style = {
	wrapper: {
		marginTop: '15px',
		position: 'absolute',
		top: '0px',
		left: '0px',
		width: '50%',
		zIndex: '99999'
	},

	text: {
		backgroundColor: 'white'
	}
}

const HelpText = observer(class HelpText extends React.Component {
		
	render() {
		const store = this.props.store;

		return (
			<div style={style.wrapper}>
				<span style={style.text}>{store.helpText}</span>
			</div>
		);
	}
});

export default HelpText;