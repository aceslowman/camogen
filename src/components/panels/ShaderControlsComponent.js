import React, { useContext, useEffect } from 'react';
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
		store.workspace.removePanel('Shader Controls')
	}

	const handleValueChange = (param,e) => {
		param.setValue(e)
	}

	const generateInterface = (shader) => {
		let controls = shader.uniforms.map((uniform)=>{ 
			return (
				<ControlGroupComponent key={uniform.name} name={uniform.name}>
					{uniform.elements.map((param,i)=>{
						
						let input = null;
						let value = param.value;

						switch (value.constructor) {
							case Boolean:
								input = (<InputBool
									key={i}
									step={0.1}
									value={value}
									onChange={(e) => handleValueChange(param,e)}
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
									onChange={(e) => handleValueChange(param,e)}
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
									onChange={(e) => handleValueChange(param,e)}
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
	
	const panels = [];

	props.data.nodes.forEach((n,i)=>(
		n.data && panels.push((
		<PanelComponent 
			key={i}
			title={n.data.name}
			collapsible
			// vertical
			gutters
		>
			{ generateInterface(n.data) }
		</PanelComponent>))
	))

	return(
		<PanelComponent 
			title="Shader Controls"			
			onRemove={handleRemove}				
			className={styles.shader_graph}	
			// vertical
			defaultSize={props.defaultSize}
		>	
			{props.data.nodes && panels}    
		</PanelComponent>
	);
});

export default ShaderControls;
