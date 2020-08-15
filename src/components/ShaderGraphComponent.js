import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import GraphComponent from './GraphComponent';

import styles from './ShaderGraphComponent.module.css'

import {
	PanelComponent,
} from 'maco-ui';

export default @observer class ShaderGraphComponent extends React.PureComponent {
	static contextType = MainContext;

	handleFocus = () => {
		this.props.data.toggleFocus();
	}

	render() {	
		this.store = this.context.store;

		return(
			<PanelComponent 
				collapsed={this.props.collapsed}
				// onRef={(ref)=> this.panelRef = ref }
				title="Shader Graph"							
				className={styles.shader_graph}	
				onRemove={()=>this.store.removePanel('Shader Graph')}
			>				
				<GraphComponent data={this.props.data}/>

				{ this.props.data.updateFlag }
			</PanelComponent>
	    )
	}
};