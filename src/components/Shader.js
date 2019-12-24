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

		for(let p_id of this.data.uniforms) {
			let uniform = [];
			let param = this.store.parameters.byId[p_id];

	        switch(param.value.constructor) {
	            case Array: 
	            	for(let i = 0; i < param.value.length; i++) {	            		
						uniform.push((
							<fieldset key={p_id+1+i}>
								<legend>{i}</legend>
								<Parameter 	
									isArray={true}						
									index={i}
									name={['x','y'][i]}
									data={param}
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
							key={p_id+1}
							data={param}							
						/>
					));
	                break;	            	            	           
	        }
		
			this.uniforms.push((
				<fieldset key={p_id}>					
	            	<legend>{param.name}</legend>
	            	<div style={style.uniformGroup}>
	            		{uniform}
	            	</div>
	            </fieldset>
			));
		}
	}

	handleRemove = () => {
		console.log(this.data);
		this.store.removeShader(this.data.id);
	}

	render() {
		const { data } = this.props;
		this.data = data;
		console.log('data', data);
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