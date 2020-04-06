import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import Node from './ui/Node';
import { entries } from 'mobx';

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props);

		// let target = props.target.ref;

		// this.shader = target.createShader(
	    //     props.data.vertex,
	    //     props.data.fragment,
        // );

        // for(let uniform_node in props.data.uniforms) {
        //     this.shader.setUniform('uniform_node.name', uniform_node.value);
        // }

        // props.data.ref = this.shader;
	}	

	generateParameters() {
		this.parameters = [];

		for (let param of this.props.data.uniforms) {			
			if (param.elements) {
				this.parameters.push((
					<fieldset 
						key={param.id}
						className="uniform_array"
					>
						<legend className="invert" style={{ padding: '2px 4px' }}>{param.name}</legend>
						<div>
							{/* TEMPORARY */}
							<Parameter 
								key={param.elements[0].id}
								data={param.elements[0]}							
							/>
							<Parameter 
								key={param.elements[1].id}
								data={param.elements[1]}							
							/>
						</div>
					</fieldset>
				));
			} else {
				this.parameters.push((
					<Parameter 
						key={param.id}
						data={param}							
					/>
				));
			}
		}
	}

	handleRemove = () => {
		this.props.target.removeShader(this.props.data);
	}

	handleSave = () => this.props.data.save();

	handleLoad = () => this.props.data.load();

	render() {
		const { data } = this.props;

		this.store = this.context.store;

		this.generateParameters();

		return(
			<Node 
				title={data.name}
				data={data} 
				onRemove={this.handleRemove}
				onSave={this.handleSave}
				onLoad={this.handleLoad}
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>	            
				{this.parameters}
			</Node>          		
	    )
	}
});

export default Shader;