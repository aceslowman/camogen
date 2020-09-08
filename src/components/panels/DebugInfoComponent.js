import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
	PanelComponent,
	TextComponent
} from 'maco-ui';
import { observer } from 'mobx-react';
// import { getSnapshot } from 'mobx-state-tree';
// import styles from './DebugInfoComponent.module.css';
import { ThemeContext } from 'maco-ui';

const DebugInfo = observer((props) => {
	const theme = useContext(ThemeContext);
	const store = useContext(MainContext).store;

	const handleRemove = () => store.removePanel('Debug');

	const selected = store.scene.shaderGraph.selectedNode;
	// console.log(selected)

	const pre_style = {
		backgroundColor: theme.secondary_color,
		color: theme.text_color,
		overflowX: 'auto'
	}

	return(
		<PanelComponent
			title="Debug"
			onRemove={handleRemove}				
		>
			<TextComponent>
				
				<div><strong>name:</strong> {selected.name}</div>
				<div><strong>branch:</strong> {selected.branch_index}</div>
				<div><strong>data:</strong> {!selected.data ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.data,null,2)}</pre>)}</div>
				<div><strong>parents:</strong> {!selected.parents.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.parents,null,2)}</pre>)}</div>
				<div><strong>children:</strong> {!selected.children.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.children,null,2)}</pre>)}</div>
				
			</TextComponent>
		</PanelComponent>		
	)
});

export default DebugInfo;