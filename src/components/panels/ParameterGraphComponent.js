import React from 'react';
import GraphComponent from '../graph/GraphComponent';
import { PanelComponent } from 'maco-ui';

import styles from './ParameterGraphComponent.module.css';

const ParameterGraph = (props) => {
	const { data } = props;	
	
	return(	
		<div className={styles.parameter_graph}>					
			<div className={styles.inner} style={{border: data ? '1px dashed white' : '1px dashed white'}}>
				{data && (<label className={styles.inner_label}>{data.parent.name + ' ' + data.name}</label>)}
					{!data && (
						<p><em>double click on a parameter to edit its graph</em></p>
					)}
					{ 
						<React.Fragment>
							<GraphComponent data={data.graph} />
							{data.graph.nodesArray.map((n,j)=>{
								return (n.data && (
									<PanelComponent 
										key={j}
										title={n.data.name}
										collapsible
										vertical
									>
										{n.data.controls}
									</PanelComponent>
								));
							})}                  
						</React.Fragment>							
					}																		 
			</div>				

			{ data.graph.updateFlag }
		</div>									
	);

}

export default ParameterGraph;