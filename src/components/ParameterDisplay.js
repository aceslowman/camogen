import React from 'react';
import Draggable from 'react-draggable';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

const style = {
	wrapper: {
		padding: '0px',
		border: '1px dashed white',
		margin: '15px',
		minWidth: '200px',
		minHeight: '200px',
	},
	legend: {
		color: 'white',
		backgroundColor: 'black', 
		border: '1px solid white',
		marginLeft: '7px',
	},
	inner: {
		backgroundColor: 'transparent',
		display: 'flex',
		flexFlow: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
		justifyItems: 'center',
		width: '100%',
		height: '100%',
		minWidth: '200px',
		minHeight: '200px',
	},
	input: {
		width: '70px',
		justifyContent: 'center',
	},
};

const ParameterDisplay = observer(class ParameterDisplay extends React.Component {

	static contextType = MainContext;

	generateNodes() {
		this.nodes = [];
		
		for(let node of this.props.data.graph) {
			console.log('node',node);
		}
	}

	render() {
		const { data } = this.props;
		this.generateNodes();
		const a_id = this.context.store.activeParameterIndex;
		this.value = a_id !== null ? data.value[a_id] : data.value

		return(
			<Draggable>
				<fieldset style={style.wrapper}>
					<legend style={style.legend}>{data.name}</legend>
					<div style={style.inner}>
						{this.nodes}
						<input
							readOnly
							style={style.input}
							type="number"
							value={this.value}
						/>	
					</div>
				</fieldset>
			</Draggable>
	    )
	}
});

export default ParameterDisplay;