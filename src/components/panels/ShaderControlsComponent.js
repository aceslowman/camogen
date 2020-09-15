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
										store.selectParameter(param);										
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
										store.selectParameter(param);										
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
										store.selectParameter(param);										
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
			expanded={n === props.data.selectedNode}
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
			defaultSize={props.defaultSize}
		>	
			{props.data.nodes && panels}    
		</PanelComponent>
	);
});

export default ShaderControls;
