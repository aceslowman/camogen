import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

import Parameter from './Parameter';

import NodeContainer from './ui/NodeContainer';

const style = {
	uniformGroup: {
		// display: 'flex',
		// flexDirection: 'row',
		// width: '100%',
	}
};

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	generateParameters() {
		this.uniforms = [];

		for(let uniform_node of this.data.uniforms) {
			let uniform = [];

			switch(uniform_node.value.constructor) {
	            case Array: 
	            	for(let i = 0; i < uniform_node.value.length; i++) {	            		
						uniform.push((
							<fieldset key={uniform_node.id+1+i}>
								<legend>{i}</legend>
								<Parameter 	
									isArray={true}						
									index={i}
									name={['x','y'][i]}
									data={uniform_node}
								/>
							</fieldset>
						));
	            	}	                
	                break;
	            case Object: 
	                break;
	            default:
	            	uniform.push((	            		
						<Parameter 
							key={uniform_node.id+1}
							data={uniform_node}							
						/>
					));
	                break;	            	            	           
	        }

	        this.uniforms.push((
				<fieldset key={uniform_node.id}>					
	            	<legend>{uniform_node.name}</legend>
	            	<div style={style.uniformGroup}>
	            		{uniform}
	            	</div>
	            </fieldset>
			));
		}
	}

	handleRemove = () => {
		this.store.removeShader(this.data.id);
	}

	render() {
		const { data } = this.props;
		this.data = data;
		this.store = this.context.store;

		this.generateParameters();

		return(
			<NodeContainer 
				title={data.name}
				data={data} 
				onRemove={this.handleRemove}
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>	            
				{this.uniforms}
			</NodeContainer>          		
	    )
	}
});

export default Shader;