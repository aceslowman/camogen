import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

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
	static contextType = MainContext;

	render() {
		const store = this.context.store;

		return (
			<div style={style.wrapper}>
				<span style={style.text}>{store.helpText}</span>
			</div>
		);
	}
});

export default HelpText;