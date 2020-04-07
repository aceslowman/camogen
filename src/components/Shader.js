import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import Node from './ui/Node';

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	componentDidMount() {
		this.generateParameters();
	}

	generateParameters() {
		this.parameters = [];

		for (let param of this.props.data.uniforms) {			
			if (param.elements) {
				this.parameters.push((
					<fieldset 
						key={param.uuid}
						className="uniform_array"
					>
						<legend className="invert" style={{ padding: '2px 4px' }}>{param.name}</legend>
						<div>
							{/* TEMPORARY */}
							<Parameter 
								key={param.elements[0].uuid}
								data={param.elements[0]}							
							/>
							<Parameter 
								key={param.elements[1].uuid}
								data={param.elements[1]}							
							/>
						</div>
					</fieldset>
				));
			} else {
				this.parameters.push((
					<Parameter 
						key={param.uuid}
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