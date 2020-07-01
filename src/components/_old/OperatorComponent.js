import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import NodeDataComponent from './NodeDataComponent';

export default @observer class OperatorComponent extends React.Component {
	static contextType = MainContext;

    handleChange = e => {    
		this.props.data.modifier = Number(e.target.value);
		this.props.graph.update();
	}

	render() {
		this.store = this.context.store;

		return(
			<NodeDataComponent data={this.props.data}>

			</NodeDataComponent>
	    )
	}
};