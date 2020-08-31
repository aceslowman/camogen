import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import { 
	PanelComponent,
	ControlGroupComponent,
	InputBool,
	InputFloat
} from 'maco-ui';

import styles from './ShaderControlsComponent.module.css'
import { observer } from 'mobx-react';

const ShaderControls = observer((props) => {
	const store = useContext(MainContext).store;

	const handleRemove = () => {
		store.removePanel('Shader Controls')
	}

	const generateInterface = (shader) => {
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
									onDoubleClick={(e) => {
										// selectedParameter = e;
										// node.graph.parent.parent.selectedParameter = e;
									}}
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
									onDoubleClick={(e) => {
										// selectedParameter = e;
										// node.graph.parent.parent.selectedParameter = e;
									}}
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
									onDoubleClick={(e) => {
										// selectedParameter = e;
										// node.graph.parent.parent.selectedParameter = e;
									}}
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

	return(
		<PanelComponent 
			title="Shader Controls"			
			onRemove={handleRemove}				
			className={styles.shader_graph}	
			vertical
		>	
			{props.data.nodes.values().map((n,j)=>(
				n.data && (
				<PanelComponent 
					key={j}
					title={n.data.name}
					collapsible
					vertical
					gutters
				>
					{ generateInterface(n.data) }
				</PanelComponent>)
			))}         
		</PanelComponent>
	);
});

export default ShaderControls;
