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
		let root = this.props.data.root;
		// console.log(root.children[0].prev)

		rows.push([(
			<Slot key={root.uuid} label={root.data.name}>
				<Shader
					key={root.data.uuid}
					data={root.data}							
				/>
			</Slot>
		)]);

		// console.log('traversal queue', this.props.data.traverse());

		this.props.data.traverse(e => {
			console.log(e.name)
		})
			
		// root.inlets.forEach( e => {
		// 	let row = [];
		// 	let node = e.node;

		// 	// go all of the way up

		// 	// traverse all northern trees
			
		// 	while(node.inlets[0]) {

		// 		node.inlets.forEach( e => {
		// 			let destination = node.inlets[0].prev.node;
		// 			console.log('inlet', destination)

		// 			// if node has data...
		// 			if(destination.data) {
		// 				console.log('this inlet has data')
		// 			} else {
		// 				console.log('this inlet DOESNT HAVE data')
		// 			}
		// 			// else
		// 			// add slots above
		// 			row.push((
		// 				<Slot key={node.uuid} label={destination.name}>
		// 					<Shader							
		// 						key={destination.data.uuid}
		// 						data={destination.data}	
		// 					/>
		// 				</Slot>
		// 			));

		// 			node = destination;
		// 		});		
			
		// 	}
			
		// 	rows.push(row)
		// })

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