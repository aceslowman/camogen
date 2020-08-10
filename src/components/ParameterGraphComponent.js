import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import GraphComponent from './GraphComponent';
import ShelfComponent from './ShelfComponent';
import NodeDataComponent from './NodeDataComponent';

import styles from './ParameterGraphComponent.module.css';

export default @observer class ParameterGraphComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props); 
		this.nodes = [];

		this.ref = React.createRef();
	}

	render() {
		const { data } = this.props;	

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
							<ShelfComponent style={{'flexShrink': 2, 'borderTop': '1px solid white'}}>
								{data.graph.nodesArray.map((n,j)=>{
									console.log(n)
									return (n.data &&
										<NodeDataComponent
											key={j}
											data={n.data}							
										/>
									)
								})}                        
							</ShelfComponent>
						</React.Fragment>							
						}																		 
				</div>				

				{ data.graph.updateFlag }
			</div>									
	    )
	}
};