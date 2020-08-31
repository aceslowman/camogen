import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
	PanelComponent,
	TextComponent
} from 'maco-ui';

const DebugInfo = (props) => {
	const store = useContext(MainContext).store;

	const handleRemove = () => store.removePanel('Debug');

	return(
		<PanelComponent
			title="Debug"
			onRemove={handleRemove}				
		>
			<TextComponent>
				<h3>currentlyEditing: {store.currentlyEditing ? store.currentlyEditing.name : 'nothing'} </h3>
				<h3>targets ({store.scenes[0].targets.length})</h3>
				<ol start="0">
					{
						store.scenes[0].targets.map((e,i)=>(
							<div key={i}>
								<li key={e.uuid}>{e.uuid}</li>

								<ol key={e.uuid+1} start="0">
									{e.shaders.map((shader)=>{											
										return (
											<li key={shader.uuid}>{shader.name}</li>
										)
									})}
								</ol>
							</div>							
						))
					}
				</ol>
				<h3>shaderGraph ({store.scene.shaderGraph.uuid})</h3>
				<ul>
					{
						store.scene.shaderGraph.map((e, i) => (
						<div key={i}>
							<li key={i}>{e.uuid}</li>
							<ul key={i+1}>
								<li key={i}>node count: {e.nodes.size}</li>
								<li key={i+1}>root: {e.root.name}</li>
								<li key={i+2}>nodes: </li>

								<ul key={i+3}>
									{e.traverse().map((uuid)=>(
										<li key={uuid}>{e.getNodeById(uuid) ? e.getNodeById(uuid).name : "can't find?"}</li>
									))}
								</ul>
							</ul>							
						</div>
						))
					}
				</ul>

				{store.activeGraph && (
					<h3>active node: {store.scene.shaderGraph.selectedNode.name}</h3>													
				)}
				
			</TextComponent>
		</PanelComponent>		
	)
}

export default DebugInfo;