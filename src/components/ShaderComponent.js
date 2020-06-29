import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import styles from './ShaderComponent.module.css';
import NodeDataComponent from './NodeDataComponent';

export default @observer class ShaderComponent extends React.Component {

	static contextType = MainContext;
	
	render() {
		this.store = this.context.store;

		return(
			<NodeDataComponent data={this.props.data}>

			</NodeDataComponent>
	    )
	}
};