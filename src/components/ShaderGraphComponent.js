import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './PanelComponent';
import GraphComponent from './GraphComponent';

import styles from './ShaderGraphComponent.module.css'

export default @observer class ShaderGraphComponent extends React.Component {
	static contextType = MainContext;

	handleFocus = () => {
		this.props.data.toggleFocus();
	}

	handleActive = () => {		
		this.store.activeTarget = this.props.data;		
	}

	render() {	
		this.store = this.context.store;

		return(
			<Panel 
				onRef={(ref)=> this.panelRef = ref }
				title="ShaderGraph"			
				active={this.store.activeTarget === this.target}
				onActive={this.handleActive}
				className={styles.shader_graph}	
				// styles={{minWidth: 230}}
			>				
				<GraphComponent data={this.props.data}/>

				{ this.props.data.updateFlag }
			</Panel>
	    )
	}
};