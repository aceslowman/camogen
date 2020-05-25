import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';
import Shader from './ShaderComponent';
import Slot from './SlotComponent';

const ShaderGraphComponent = observer(class ShaderGraphComponent extends React.Component {
	static contextType = MainContext;

	constructor(){
		super();

		this.slots = [];
	}

	handleActive = () => {		
		this.store.activeTarget = this.props.data;		
	}

	handleRemove = () => {
		this.store.removeGraph(this.props.data);
	}

	generateSlots = () => {
		let rows = [];

		// traverse from root node
		this.props.data.traverse((next_node, distance_from_root) => {
			if (distance_from_root === rows.length) {
				rows.push([]);
			}

			if (next_node.data) {
				rows[distance_from_root].push((
					<Slot 
						data={next_node} 
						key={next_node.uuid} 
						label={next_node.data.name}
					>
						<Shader
							key={next_node.data.uuid}
							data={next_node.data}							
						/>
					</Slot>
				));
			} else {				
				let count = distance_from_root;

				// add empty slot above
				rows[count].push((
					<Slot 
						data={next_node} 
						key={next_node.uuid} 
						label={next_node.name}
					/>
				));								
			}	

			//and add placeholders all of the way up
			for(let i = distance_from_root + 1; i < rows.length; i++) {
				rows[i].push((
					<Slot 
						hidden
						data={next_node}  
						key={i} 
					/>
				));
			}		
		})

		return rows.map((e,i) => (
			<div key={i} className="slotRow">
				{e}
			</div>
		));
	}

	render() {	
		this.store = this.context.store;

		return(
			<Panel 
				onRef={(ref)=> this.panelRef = ref }
				title={"ShaderGraph"}
				active={this.store.activeTarget === this.target}
				onRemove={this.handleRemove}
				onActive={this.handleActive}	
			>				
				{ this.props.data.updateFlag }
				{ this.generateSlots() }
			</Panel>
	    )
	}
});

export default ShaderGraphComponent;