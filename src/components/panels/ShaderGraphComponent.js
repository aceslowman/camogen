import React, { useContext, useEffect, useRef, useState } from 'react';
import MainContext from '../../MainContext';
import GraphComponent from '../graph/GraphComponent';
import { PanelComponent } from 'maco-ui';
import { observer } from 'mobx-react';

const ShaderGraph = observer((props) => {
	const store = useContext(MainContext).store;
	const mainRef = useRef(null);
	const [useKeys, setUseKeys] = useState(false);

	const handleFocus = (e) => {
		setUseKeys(e ? true : false);
	}

	useEffect(()=>{
		if(useKeys) {
			store.context.setKeymap({
				"ArrowUp": () => {
					if (props.selectedNode && props.selectedNode.parents.length)
						props.selectedNode.parents[0].select()						
				},
				"ArrowDown": () => {
					if (props.selectedNode && props.selectedNode.children.length)
						props.selectedNode.children[0].select()						
				},
				"ArrowLeft": () => {
					if (props.selectedNode && props.selectedNode.children.length) {
						let idx = props.selectedNode.children[0].parents.indexOf(props.selectedNode);
						idx--;

						if (idx >= 0) {
							props.selectedNode.children[0].parents[idx].select();
						}
					}
				},
				"ArrowRight": () => {
					if (props.selectedNode && props.selectedNode.children.length) {
						let idx = props.selectedNode.children[0].parents.indexOf(props.selectedNode);
						idx++;

						if (idx <= props.selectedNode.children[0].parents.length - 1)
							props.selectedNode.children[0].parents[idx].select();
					}
				},
				"Delete": () => {
					props.data.removeSelected();
				}
			})
		} else {
			store.context.removeKeymap();
		}
	}, [
		props.selectedNode,
		props.data,
		store.context,
		useKeys
	])
	
	const handleContextMenu = (e) => {
		e.stopPropagation();
		e.preventDefault();
		store.context.setContextmenu([{
			label: "Clear",
			onClick: () => store.scene.clear()
		}])
	}

	return(
		<PanelComponent 
			detachable
			onDetach={props.onDetach ? props.onDetach : () => {}}
			collapsed={props.collapsed}
			title="Shader Graph"				
			onRemove={()=>store.workspace.removePanel('Shader Graph')}
			defaultSize={props.defaultSize}
			onFocus={handleFocus}
			onRef={mainRef}
			onContextMenu={handleContextMenu}
			indicators={useKeys ? [
				{label:'k', color: store.theme.accent_color, title: 'Keybind Focus'}
			] : null}
		>				
			<GraphComponent 
				data={props.data}
				coord_bounds={props.coord_bounds}
				selectedNode={props.selectedNode}
			/>

			{ props.data && props.data.updateFlag }
		</PanelComponent>
	)  
});

export default ShaderGraph;