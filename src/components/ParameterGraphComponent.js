import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import GraphComponent from './GraphComponent';
import ShelfComponent from './ShelfComponent';
import OperatorComponent from './OperatorComponent';

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
		// should not show up after every op update...
		console.log('SHOULD APPEAR AFTER ADDING OP',this.props.data)

		return(	
			<div className={styles.parameter_graph}>					
				<div className={styles.inner} style={{border: data ? '1px dashed white' : '1px dashed white'}}>
					{data && (<label>{data.parent.name + ' ' + data.name}</label>)}
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
										<OperatorComponent
											key={j}
											data={n.data}							
										/>
									)
								})}                        
							</ShelfComponent>
						</React.Fragment>							
						}																		 
				</div>
				
				{data && (<div className={styles.inventory}>	
					<h4>input:</h4>				
					<div>
						<button onClick={
							() => data.graph.setSelectedByName('MIDI')
						}>midi</button>
						<button onClick={
							() => data.graph.setSelectedByName('OscListener')
						}>osc</button>
						<button onClick={
							() => data.graph.setSelectedByName('Counter')
						}>counter</button>
					</div>
					<h4>ops:</h4>				
					<div>
						<button onClick={
							() => data.graph.setSelectedByName('Add')
						}>+</button>
						<button onClick={
							() => data.graph.setSelectedByName('Subtract')
						}>-</button>
						<button onClick={
							() => data.graph.setSelectedByName('Divide')
						}>/</button>
						<button onClick={
							() => data.graph.setSelectedByName('Multiply')
						}>*</button>
						<button onClick={
							() => data.graph.setSelectedByName('Modulus')
						}>%</button>
					</div>
					<h4>trig:</h4>
					<div>
						<button onClick={
							() => data.graph.setSelectedByName('Sin')
						}>sin</button>
						<button onClick={
							() => data.graph.setSelectedByName('Cos')
						}>cos</button>
						<button onClick={
							() => data.graph.setSelectedByName('Tan')
						}>tan</button>
					</div>					
				</div>)}

				{ data.graph.updateFlag }
			</div>									
	    )
	}
};