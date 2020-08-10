import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/PanelComponent';
import Shelf from './ShelfComponent';
import NodeDataComponent from './NodeDataComponent';

import styles from './ShaderControlsComponent.module.css'

export default @observer class ShaderControlsComponent extends React.PureComponent {
	static contextType = MainContext;

	handleFocus = () => {
		this.props.data.toggleFocus();
	}

	render() {	
		this.store = this.context.store;

		return(
			<Panel 
				collapsed={this.props.collapsed}
				onRef={(ref)=> this.panelRef = ref }
				onRemove={()=>this.store.removePanel('Shader Controls')}
				title="Shader Controls"			
				className={styles.shader_graph}	
			>				
				<Shelf>
					{this.props.data.nodesArray.map((n,j)=>(
					n.data &&
						<NodeDataComponent
							key={j}
							data={n.data}							
						/>
					))}                        
				</Shelf>
			</Panel>
	    )
	}
};