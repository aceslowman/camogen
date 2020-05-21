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

const TargetComponent = observer(class TargetComponent extends React.Component {
	static contextType = MainContext;

	constructor(){
		super();

		this.slots = [];

		this.state = {
			bounds: null
		}
	}

	componentDidMount(){
		// this.updateCanvas();	
		this.setState({
			bounds: this.panelRef.getBoundingClientRect()
		});
	}

	// updateCanvas = () => {

	// 	this.panelRef && (style.canvas = {
	// 		...style.canvas, 
	// 		width: this.panelRef.offsetWidth+'px',
	// 		height: this.panelRef.offsetHeight+'px',
	// 	})

	// 	const ctx = this.refs.canvas.getContext('2d');

	// 	let bounds = this.panelRef.getBoundingClientRect();

	// 	console.log(bounds)
		
	// 	console.log(ctx)

	// 	ctx.fillStyle = "red";
	// 	ctx.lineWidth = 2;
	// 	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	// 	ctx.strokeStyle = "white";
	// 	// this.props.data.shaders.forEach((e_start) => {
	// 	// 	e_start.texture_outputs.forEach((e_end)=>{
	// 	// 		console.log(e_end)
	// 	// 		console.log(this.panelRef)
	// 	// 		let start = [
	// 	// 			e_start.position.x - this.panelRef.offsetLeft,
	// 	// 			e_start.position.y - this.panelRef.offsetTop
	// 	// 		]
	// 	// 		let end = [
	// 	// 			e_end.shader.position.x - this.panelRef.offsetLeft,
	// 	// 			e_end.shader.position.y - this.panelRef.offsetTop
	// 	// 		]
	// 	// 		// console.log(e)
	// 	// 		ctx.beginPath();
	// 	// 		ctx.moveTo(start[0], start[1]);
	// 	// 		ctx.lineTo(end[0], end[1]);
	// 	// 		ctx.stroke();
	// 	// 	})			
	// 	// })
	// }

	handleActive = () => {		
		this.store.activeTarget = this.props.data;		
	}

	handleRemove = () => {
		this.store.removeTarget(this.props.data);
	}

	generateSlots = () => {
		let rows = [];

		// traverse from root node
		let shader = this.props.data.shaders[0];
		let iteration = 0;
		// console.log(shader.outlets[0].next)

		rows.push([(
			<Slot key={shader.uuid}>
				<Shader
					bounds={this.state.bounds}
					key={shader.uuid}
					data={shader}	
					onCanvasUpdate={this.updateCanvas}							
				/>
			</Slot>
		)]);
		
		while(shader.outlets[0].next) {
			shader = shader.outlets[0].next.node;

			// current slot
			rows.push([(
				<Slot key={shader.uuid}>
					<Shader
						bounds={this.state.bounds}
						key={shader.uuid}
						data={shader}	
						onCanvasUpdate={this.updateCanvas}							
					/>
				</Slot>
			)]);

			// if shader has more than one inlet...
			// create a new target, and run up the chain

			iteration++;
		}

 		// next output slot
		// rows.push([(
		// 	<Slot key={0}/>			 
		// )]);		

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
				title={"Target"}
				active={this.store.activeTarget === this.target}
				onRemove={this.handleRemove}
				onActive={this.handleActive}	
			>				
				{ this.generateSlots() }
			</Panel>
	    )
	}
});

export default TargetComponent;