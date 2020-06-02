import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import OperatorComponent from './OperatorComponent';
import Parameter from './ParameterComponent';
import GraphComponent from './graph/GraphComponent';

const ParameterGraphComponent = observer(class ParameterGraphComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props);
		this.nodes = [];

		this.ref = React.createRef();
	}

	generateNodes() {
		this.nodes = [];

		if (!this.props.data.graph) return;
		for (let i = 0; i < this.props.data.graph.nodes.length; i++) {
			let node = this.props.data.graph.nodes[i];

			this.nodes.push((
				<OperatorComponent key={i} data={node} graph={this.props.data.graph}/>
			));
		}
	}

	render() {
		const { data } = this.props;
		if(data) this.generateNodes();		

		return(	
			<div className="parameter_graph">					
				<fieldset style={{border: data ? '1px dashed white' : '1px dashed white'}}>
					{data && (<label>{data.parent.name + ' ' + data.name}</label>)}
					<div>
						{!data && (
						<p><em>double click on a parameter to edit its graph</em></p>
						)}
						{this.nodes}
					</div>										
					{data && (<Parameter 
						key={data.uuid}
						data={data}						
					/>)}				
				</fieldset>
				{/* <Graph
					data={}
				/>	 */}
				{data && (<div>	
					<h4>input:</h4>				
					<div>
						<button onClick={
							() => data.graph.addNode('MIDI')
						}>midi</button>
						<button onClick={
							() => data.graph.addNode('OscListener')
						}>osc</button>
						<button onClick={
							() => data.graph.addNode('Counter')
						}>counter</button>
					</div>
					<h4>ops:</h4>				
					<div>
						<button onClick={
							() => data.graph.addNode('Add')
						}>+</button>
						<button onClick={
							() => data.graph.addNode('Subtract')
						}>-</button>
						<button onClick={
							() => data.graph.addNode('Divide')
						}>/</button>
						<button onClick={
							() => data.graph.addNode('Multiply')
						}>*</button>
						<button onClick={
							() => data.graph.addNode('Modulus')
						}>%</button>
					</div>
					<h4>trig:</h4>
					<div>
						<button onClick={
							() => data.graph.addNode('Sin')
						}>sin</button>
						<button onClick={
							() => data.graph.addNode('Cos')
						}>cos</button>
						<button onClick={
							() => data.graph.addNode('Tan')
						}>tan</button>
					</div>					
				</div>)}
			</div>	
											
	    )
	}
});

export default ParameterGraphComponent;