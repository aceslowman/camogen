import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import NodeContainer from './ui/NodeContainer';

// const style = {};

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props);

		let target = props.target.ref;

		this.shader = target.createShader(
	        props.data.vertex,
	        props.data.fragment,
        );

        for(let uniform_node in props.data.uniforms) {
            this.shader.setUniform('uniform_node.name', uniform_node.value);
        }

        props.data.ref = this.shader;
	}	

	generateParameters() {
		this.uniforms = [];

		for(let uniform_node of this.props.data.uniforms) {
			let uniform = [];

			switch(uniform_node.value.constructor) {
	            case Array: 
	            	let uniform_group = [];

	            	for(let i = 0; i < uniform_node.value.length; i++) {	            		
						uniform_group.push((
							<Parameter 	
								key={uniform_node.id+i}
								isArray={true}						
								index={i}
								name={['x','y'][i]}
								data={uniform_node}
							/>
						));						
	            	}	   

	            	uniform.push((
						<fieldset 
							key={uniform_node.id}
							style={{
								padding: '0px',
							}}
						>
							<legend>{uniform_node.name}</legend>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									width: '100%',
								}}
							>
								{uniform_group}
							</div>
						</fieldset>
					));             
	                break;
	            default:
	            	uniform.push((	            		
						<Parameter 
							key={uniform_node.id}
							data={uniform_node}							
						/>
					));
	                break;	            	            	           
	        }

	        this.uniforms.push(uniform);
		}
	}

	handleRemove = () => {
		this.store.removeShader(this.props.data, this.props.target);
	}

	render() {
		const { data } = this.props;

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