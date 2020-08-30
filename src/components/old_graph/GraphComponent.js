import React from 'react';
import Rail from './RailComponent';
import styles from './GraphComponent.module.css';

const GraphComponent = (props) => {
	const generate = () => {
		let rows = [];
    
		props.data.traverse((node, distance_from_root) => {
			if (distance_from_root === rows.length) {
				rows.push([]);
			}

			if (node.data) {
				rows[distance_from_root].push((
                    <Rail 
                        key={node.uuid}    
						data={node} 						
						label={node.name}
					/>
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

		rows = rows.map((e,i) => (
			<div key={i}>
				{e}	
			</div>
		));            

		return rows;
	}

	return (						
		<div className={styles.graph}>
			<div className={styles.graph_rows}>
				{ generate() }
			</div>

			{ props.data.updateFlag }
		</div>				
	);
}

export default GraphComponent;