import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

const style = {
	wrapper: {
		padding: '0px',
		border: '1px dashed white',
		// backgroundColor: 'white'
	},
	legend: {
		color: 'white',
		backgroundColor: 'black', 
		border: '1px solid white',
		marginLeft: '7px'
	}
};

const RenderTarget = observer(class RenderTarget extends React.Component {

	static contextType = MainContext;

	static assemble = (pg) => {		
		return {};
	}

	render() {
		return(
			<Draggable>
				<fieldset style={style.wrapper}>
					<legend style={style.legend}>target</legend>
					{this.props.children}
				</fieldset>
			</Draggable>
	    )
	}
});

export default RenderTarget;