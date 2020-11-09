import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
	GenericPanel,
	PanelComponent,
	TextComponent
} from 'maco-ui';
import { observer } from 'mobx-react';
import { ThemeContext } from 'maco-ui';
import { getSnapshot } from 'mobx-state-tree';

const DebugInfo = observer((props) => {
	const theme = useContext(ThemeContext);
	const store = useContext(MainContext).store;

	const scene = store.scene;
	const graph = store.scene.shaderGraph;
	const selected = store.scene.shaderGraph.selectedNode;
	const targets = store.scene.targets;
	const selectedParam = store.selectedParameter;

	const pre_style = {
		backgroundColor: theme.secondary_color,
		color: theme.text_color,
		overflowX: 'auto'
	}

	return(
		<GenericPanel panel={props.panel}>
			<PanelComponent
				title="graph"
				collapsible
				gutters
			>
				<TextComponent>					

					<ul>
						{
							
							Array.from(graph.nodes.values()).map((shader,i)=>(
								<li key={i}>{shader.name}</li>								
							))
						}
					</ul>
										
				</TextComponent>
			</PanelComponent>

			<PanelComponent
				title="graph"
				collapsible
				gutters
			>
				<TextComponent>					

					<pre>
						{JSON.stringify(getSnapshot(scene.operatorGraphs), null, 5)}
					</pre>
										
				</TextComponent>
			</PanelComponent>

			<PanelComponent
				title="target"
				collapsible
				gutters
			>
				<TextComponent>					

					{
						targets.map((target,i)=>(
							<React.Fragment key={i}>
								<h3>target #{i}</h3>
								<ol>
									{target.render_queue.map((shader,j)=>(
										<li key={j}>{shader.name}</li>
									))}
								</ol>
							</React.Fragment>							
						))
					}
										
				</TextComponent>
			</PanelComponent>
			<PanelComponent
				title="selected node"
				collapsible
				gutters
			>
				<TextComponent>					
					<div><strong>name:</strong> {selected.name}</div>
					<div><strong>branch:</strong> {selected.branch_index}</div>
					<div><strong>data:</strong> {!selected.data ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.data,null,2)}</pre>)}</div>
					<div><strong>parents:</strong> {!selected.parents.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.parents,null,2)}</pre>)}</div>
					<div><strong>children:</strong> {!selected.children.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.children,null,2)}</pre>)}</div>					
				</TextComponent>
			</PanelComponent>

			<PanelComponent
				title="selected param"
				collapsible
				gutters
			>
				<TextComponent>					
					{/* <div><strong>name:</strong> {selected.name}</div>
					<div><strong>branch:</strong> {selected.branch_index}</div>
					<div><strong>data:</strong> {!selected.data ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.data,null,2)}</pre>)}</div>
					<div><strong>parents:</strong> {!selected.parents.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.parents,null,2)}</pre>)}</div>
					<div><strong>children:</strong> {!selected.children.length ? 'none' : (<pre style={pre_style}>{JSON.stringify(selected.children,null,2)}</pre>)}</div>					 */}
					<pre>{selectedParam && JSON.stringify(getSnapshot(selectedParam),null, 5)}</pre>
				</TextComponent>
			</PanelComponent>

			
		</GenericPanel>		
	)
});

export default DebugInfo;