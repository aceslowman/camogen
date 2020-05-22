import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';
import Shader from './ShaderComponent';
import Slot from './SlotComponent';

let style = {
	canvas: {
		width: '10px',
		height: '10px',
	}
}

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
		this.store.removeTarget(this.props.data);
	}

	generateSlots = () => {
		let rows = [];

		// traverse from root node
		/* 
			currently returning shader, 
			should return node
		*/
		// let root = this.props.data.root;
		// console.log(root.children[0].prev)
		
		this.props.data.traverse((next_node, container, distance_from_root) => {
			// console.log(next_node.name)
			if (rows.length <= distance_from_root+1) {
				rows.push([]);
			}

			if (next_node.data) {
				rows[distance_from_root].push((
					<Slot key={next_node.uuid} label={next_node.data.name}>
						<Shader
							key={next_node.data.uuid}
							data={next_node.data}							
						/>
					</Slot>
				));
			} else {
				let count = distance_from_root+2;
				console.log('COUNT',count)

				// add empty slot above
				rows[count].push((
					<Slot key={next_node.uuid} label={next_node.name}>
					
					</Slot>
				));

				//and add placeholders all of the way up
				for(let i = count + 1; i < rows.length; i++) {
					rows[i].push((
						<Slot hidden key={i} />
					));
				}
				
			}
			
		})

		console.log(rows)
			

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
				{ this.generateSlots() }
			</Panel>
	    )
	}
});

export default ShaderGraphComponent;