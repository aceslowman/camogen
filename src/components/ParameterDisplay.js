import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

import NodeContainer from './ui/NodeContainer';

const style = {
	wrapper: {
		padding: '0px',
		border: '1px dashed white',
		// backgroundColor: 'white'		
		margin: '15px',
	},
	legend: {
		color: 'white',
		backgroundColor: 'black', 
		border: '1px solid white',
		marginLeft: '7px',
	},
	inner: {
		backgroundColor: 'transparent',
		border: '1px solid white',
		margin: '15px',
		width: '500px',
		height : '750px',
	},
};

const ParameterDisplay = observer(class ParameterDisplay extends React.Component {

	static contextType = MainContext;

	static assemble = (pg) => {		
		return {};
	}

	render() {
		return(
			<Draggable>
				<fieldset style={style.wrapper}>
					<legend style={style.legend}>parameters</legend>
					<NodeContainer>
					</NodeContainer>
				</fieldset>
			</Draggable>
	    )
	}
});

export default ParameterDisplay;