import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import { 
	PanelComponent,
	ControlGroupComponent,
	InputBool,
	InputFloat
} from 'maco-ui';

import styles from './ShaderControlsComponent.module.css'

export default @observer class ShaderControlsComponent extends React.PureComponent {
	static contextType = MainContext;

	handleFocus = () => {
		this.props.data.toggleFocus();
	}

	handleRemove = () => {
		this.store.removePanel('Shader Controls')
	}

	generateInterface = (shader) => {
		// console.log(`generating controls for ${this.name}`,this)
		let controls = shader.uniforms.map((uniform)=>{ 
			return (
				<ControlGroupComponent key={uniform.uuid} name={uniform.name}>
					{uniform.elements.map((param,i)=>{
						
						let input = null;
						let value = param.value;

						switch (value.constructor) {
							case Boolean:
								input = (<InputBool
									key={i}
									step={0.1}
									value={value}
									onChange={e => {
										param.value = e;
									}}
									// onDblClick={(e) => {
									// 	this.selectedParameter = e;
									// 	this.node.graph.parent.parent.selectedParameter = e;
									// }}
								/>);
							break;
							case Number:
								input = (<InputFloat
									key={i}
									step={0.1}
									value={value}
									onChange={e => {
										param.value = e;
									}}
									// onDblClick={(e) => {
									// 	this.selectedParameter = e;
									// 	this.node.graph.parent.parent.selectedParameter = e;
									// }}
								/>);
							break;
							default:
								input = (<InputFloat
									key={i}
									step={0.1}
									value={value}
									onChange={e => {
										param.value = e;
									}}
									// onDblClick={(e) => {
									// 	this.selectedParameter = e;
									// 	this.node.graph.parent.parent.selectedParameter = e;
									// }}
								/>);
							break;
						}
						
						return input;                                                        
					})}
				</ControlGroupComponent>                    
			);                     
		});

		return controls;
	}

	render() {	
		this.store = this.context.store;

		return(
			<PanelComponent 
				title="Shader Controls"			
				onRemove={this.handleRemove}				
				className={styles.shader_graph}	
				vertical
			>	
				{this.props.data.nodesArray.map((n,j)=>(
					n.data && (
					<PanelComponent 
						key={j}
						title={n.data.name}
						collapsible
						vertical
					>
						{/* {n.data.controls} */}
						{this.generateInterface(n.data)}
					</PanelComponent>)
				))}         
			</PanelComponent>
	    )
	}
};