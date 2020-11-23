import React, { useContext, useState } from 'react';
import MainContext from '../../MainContext';
import GraphComponent from '../graph/GraphComponent';

import { PanelComponent } from 'maco-ui';
import { observer } from 'mobx-react';
import useKeymap from '../hooks/UseKeymap';

const OperatorGraph = observer((props) => {
	const store = useContext(MainContext).store;
	const [useKeys, setUseKeys] = useState(false);

	useKeymap({
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
		"ArrowUp": () => {
			if (props.selectedNode && props.selectedNode.parents.length)
				props.selectedNode.parents[0].select()
		},
		"Delete": () => {
			props.data.graph.removeSelected();
		}
	}, useKeys)

	const handleFocus = (e) => {
		setUseKeys(e ? true : false);
	}

	return(
		<PanelComponent 
			detachable
			onDetach={props.onDetach ? props.onDetach : () => {}}
			collapsed={props.collapsed}
			//title="Operator Graph"				
			onRemove={()=>store.workspace.removePanel('Operator Graph')}
			defaultSize={props.defaultSize}
			onFocus={handleFocus}
			indicators={useKeys ? [
				{label:'k', color: store.theme.accent_color, title: 'Keybind Focus'}
			] : null}
		>				
			<GraphComponent 
				data={props.data.graph}
				coord_bounds={props.coord_bounds}
				selectedNode={props.selectedNode}
			/>

			{ props.data && props.data.updateFlag }
		</PanelComponent>
	)  
});

export default OperatorGraph;