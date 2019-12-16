import React from 'react';
import NodeContainer from './NodeContainer';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

const style = {
	wrapper: {
		padding: '0px',
		border: '1px dashed black',
	},
};

const RenderTarget = observer(class RenderTarget extends React.Component {

	static contextType = MainContext;

	static assemble = (pg) => {		
		return {};
	}

	render() {
		return(
			<fieldset style={style.wrapper}>
				<legend>target</legend>
				{this.props.children}
			</fieldset>
	    )
	}
});

export default RenderTarget;