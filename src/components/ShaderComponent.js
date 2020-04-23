import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Uniform from './UniformComponent';
import Node from './ui/Node';

const ShaderComponent = observer(class ShaderComponent extends React.Component {
	static contextType = MainContext;

	handleRemove = () => {
		this.props.data.target.removeShader(this.props.data);
	}

	render() {
		const { data } = this.props;

		this.store = this.context.store;

		return(
			<Node 
				title={data.name}
				data={data} 
				onRemove={this.handleRemove}
				onSave={()=>data.save()}
				onLoad={()=>data.load()}
			>	            
				{data.uniforms.map((uniform)=>{                        
					return (
						<Uniform 
							key={uniform.uuid}
							data={uniform}				
						/>
					);                     
				})}
			</Node>          		
	    );
	}
});

export default ShaderComponent;