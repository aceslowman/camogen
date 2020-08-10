import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/PanelComponent';
import TextComponent from './ui/TextComponent';

export default @observer class DebugInfo extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;
	}

	render() {		
		this.store = this.context.store;

		return(
			<Panel
				collapsed={this.props.collapsed}
				onRemove={()=>this.store.removePanel('Debug')}
				title="Debug" 
				style={{
					backgroundColor: 'black',
				}}
			>
				<TextComponent>
					<h3> currentlyEditing: {
						this.store.currentlyEditing ? this.store.currentlyEditing.name : 'nothing'
					} </h3>
					<h3>targets ({this.store.scenes[0].targets.length})</h3>
					<ol start="0">
						{
							this.store.scenes[0].targets.map((e,i)=>(
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
					<h3>shaderGraphs ({this.store.scenes[0].shaderGraphs.length})</h3>
					<ul>
						{
							this.store.scenes[0].shaderGraphs.map((e, i) => (
							<div key={i}>
								<li key={i}>{e.uuid}</li>
								<ul key={i+1}>
									<li key={i}>node count: {e.nodeCount}</li>
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
					{this.store.activeGraph && (
						<React.Fragment>
							<h3>active node: {this.store.scenes[0].activeGraph.selectedNode.name}</h3>							
						</React.Fragment>							
					)}
					
				</TextComponent>
			</Panel>		
	    )
	}
};
