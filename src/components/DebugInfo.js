import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/PanelComponent';

const DebugInfo = observer(class DebugInfo extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;
	}

	render() {		
		this.store = this.context.store;

		return(
			<Panel 
				style={{
					backgroundColor: 'black',
				}}
			>
				<div id="SPLASH">
					<h3>targets ({this.store.targets.length})</h3>
					<ol start="0">
						{this.store.targets.map((e,i)=>(
							<React.Fragment>
								<li key={e.uuid}>{e.uuid}</li>

								<ol start="0" key={e.uuid+1}>
									{e.shaders.map((shader,i)=>(
										<li key={i}>{shader.name}</li>
									))}
								</ol>
							</React.Fragment>							
						))}
					</ol>
					<h3>shaderGraphs ({this.store.shaderGraphs.length})</h3>
					<ul>
						{this.store.shaderGraphs.map((e,i)=>(
							<React.Fragment>
								<li key={i}>{e.uuid}</li>
								<ul key={i+1}>
									<li key={i}>node count: {e.nodeCount}</li>
									<li key={i+1}>root: {e.root.name}</li>
									<li key={i+2}>nodes: </li>

									<ul key={i+3}>
										{e.traverse().map((uuid)=>(
											<li>{e.getNodeById(uuid) ? e.getNodeById(uuid).name : "can't find?"}</li>
										))}
									</ul>
								</ul>
								
							</React.Fragment>							
						))}
					</ul>
					{this.store.activeGraph && (
						<React.Fragment>
							<h3>active node: {this.store.activeGraph.activeNode.name}</h3>							
						</React.Fragment>							
					)}
					
				</div>
			</Panel>		
	    )
	}
});

export default DebugInfo;