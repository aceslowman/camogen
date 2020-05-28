import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import Panel from '../ui/PanelComponent';
import Rail from './RailComponent';

import styles from './GraphComponent.module.css';

const GraphComponent = observer(class GraphComponent extends React.Component {
    static contextType = MainContext;   
    rows = [];

    handleActive = () => {
        // this.store.selectGraph(this.props.data);
    }

	handleRemove = () => {
		this.store.removeGraph(this.props.data);
	}

	generate = () => {
        let rows = [];
    
		this.props.data.traverse((node, distance_from_root) => {
			if (distance_from_root === rows.length) {
				rows.push([]);
			}

			if (node.data) {
				rows[distance_from_root].push((
                    <Rail 
                        key={node.uuid}    
						data={node} 						
						label={node.data.name}
					>
						{/* <Shader
							key={node.data.uuid}
							data={node.data}							
						/> */}
					</Rail>
				));
			} else {				
				let count = distance_from_root;

				// add empty slot above
				rows[count].push((
                    <Rail 
                        key={node.uuid} 
						data={node} 						
						label={node.name}
					/>
				));								
			}	

			//and add placeholders all of the way up
			for(let i = distance_from_root + 1; i < rows.length; i++) {
				// rows[i].push((
				// 	<Rail 
                //         key={i} 
				// 		data={node}  						
				// 	/>
				// ));
			}		
		})		

		this.rows = rows.map((e,i) => (
			<div key={i}>
				{e}	
			</div>
		));            
	}

	render() {	
		this.store = this.context.store;

		this.generate();

		return(
			<Panel 
				onRef={ref => this.panelRef = ref}
				title="Graph"			
				active={this.store.activeGraph === this.data}
				onRemove={this.handleRemove}
				onActive={this.handleActive}
				className={styles.graph}	
			>				
				
				<div className={styles.graph_rows}>
					{ this.rows }
				</div>

				{ this.props.data.updateFlag ? '' : '' }
			</Panel>
	    )
	}
});

export default GraphComponent;