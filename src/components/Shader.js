import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

import Parameter from './Parameter';

import NodeContainer from './ui/NodeContainer';

const style = {};

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	generateParameters() {
		this.uniforms = [];

		for(let u_id of this.data.uniforms) {
			let param = this.store.parameters.byId[u_id];
			this.uniforms.push(<Parameter key={param.id} data={param} />);
		}
	}

	render() {
		this.data = this.props.data;
		this.store = this.context.store;

		this.generateParameters();

		return(
			<NodeContainer 
				title={this.data.name} 
				node={this.props.data} 
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>	            
				{this.uniforms}
			</NodeContainer>          		
	    )
	}
});

export default Shader;