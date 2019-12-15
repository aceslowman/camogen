import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import Inlet from './Inlet';
import Outlet from './Outlet';

const style = {
	wrapper: {
		marginBottom:'15px', 
		backgroundColor: 'white',
		width: '230px',
		border: '1px solid black',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		zIndex: '100',
	},

	buttons: {
		padding: '5px',
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		boxSizing: 'border-box',
		color: 'white',
		backgroundColor: 'black',
		// fontWeight: 'bold'
	},

	main: {
		flexGrow: '1',
		// backgroundColor: 'blue',
		padding: '5px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},

	legend: {		
		fontWeight: 'bold',
		// backgroundColor: 'orange',
		fontSize: '1.6em'
	},

	inlets: {
		minWidth: '10px',
		height: '13px',
		border: '1px solid black',
		backgroundColor: 'white',
		// zIndex: '99',
		fontSize: '0.9em',
		// float: 'left',
		display: 'flex',
		flexDirection: 'row',
	},

	inletIcon: {
		height: '13px',
		width: '13px',
		backgroundColor: 'white',
		borderRight: '1px solid black',
		boxSizing: 'border-box',
	},

	inletBar: {
		width: '100%',
		listStyle: 'none',
		margin: '0px',
		padding: '0px',
		// backgroundColor: 'yellow',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-start',
		zIndex: '99',
	},

	hint: {
		padding: '0px 2px',
	},

	top: {
		position: 'absolute',
		top: '-15px',
		left: '18px',
	},

	bottom: {
		position: 'absolute',
		bottom: '-15px',
		left: '18px',
	},

	params: {
		overflow: 'hidden',
		padding: '5px', 
	},
};

const NodeContainer = observer(class NodeContainer extends React.Component {

	constructor() {
		super();

		this.state = {
			active: false,
			expanded: false,
			dragging: false,
		};
	}

	handleClick() {		
		this.setState(prevState => ({
			...prevState,
			active: !prevState.active
		}));
	}

	handleExpand() {
		this.setState(prevState => ({
			...prevState,
			expanded: !prevState.expanded
		}));
	}

	handleDrag(e) {
		// console.log('handleDrag', e);
	}

	handleDragStart(e) {
		console.log('handleStart', e);
		this.setState({ dragging: true });

		this.handleClick();
	}

	handleDragStop(e) {
		console.log('handleStop', e);
		this.setState({ dragging: false });
	}

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		style.params = {
			...style.params,
			display: this.state.expanded ? 'block' : 'none',
			height: this.state.expanded ? 'auto' : '0%',
		}

		style.main = {
			...style.main,
			boxShadow: this.state.dragging ? '5px 5px' : this.state.active ? '3px 3px' : '0px 0px',
		};

		let inlets = [];
		let outlets = [];

		if(this.props.inlets) {
			for(let inlet of this.props.inlets) {
				inlets.push(<li><Inlet hint={inlet.hint} /></li>);
			}
		}

		if(this.props.outlets) {
			for(let outlet of this.props.outlets) {
				outlets.push(<li><Outlet hint={outlet.hint} /></li>);
			}
		}

		return(
			<Draggable
				onDrag={(e) => this.handleDrag(e)}
				onStart={(e) => this.handleDragStart(e)}
				onStop={(e) => this.handleDragStop(e)}
			>
				<div style={style.wrapper} >
					
						<div style={style.top}>
							<ul style={style.inletBar}>
								{inlets}
							</ul>		
						</div>

						<div style={style.buttons}>
							<a style={style.remove} onClick={() => store.removeNode(this.props.node_id)}>x</a>
			          		<a style={style.expand} onClick={() => this.handleExpand()}>{this.state.expanded ? 'v' : '>'}</a>
			          		<a style={style.expand} onClick={() => this.handleExpand()}>≡</a>
			          	</div>

			          	<div style={style.main}>
				            <legend style={style.legend}>{this.props.title}</legend>				           

				            <div style={style.params}>
				            	{this.props.children}	
				            </div>
			            </div>

			           	<div style={style.bottom}>
							<ul style={style.inletBar}>
								{outlets}
							</ul>		
						</div>          
			         
		        </div>
			</Draggable>
	    )
	}
});

export default NodeContainer;