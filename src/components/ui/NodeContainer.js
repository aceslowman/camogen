import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

import Inlet from './Inlet';
import Outlet from './Outlet';

const style = {
	wrapper: {
		margin:'15px', 
		backgroundColor: 'black',
		border: '1px solid white',
		width: '230px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		zIndex: '100',
	},

	buttons: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		boxSizing: 'border-box',
		color: 'white',
	},

	button: {
		padding: '2.5px 5px',
		boxSizing: 'border-box',
		backgroundColor: 'black',
		border: 'none',
		color: 'white',
	},

	main: {
		border: '1px solid black',
		backgroundColor: 'white',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		width: '100%',
	},

	legend: {		
		fontWeight: 'bold',
		fontSize: '1.6em',
		margin: '5px 5px',
		cursor: 'pointer'
	},

	inlets: {
		minWidth: '10px',
		height: '13px',
		border: '1px solid black',
		backgroundColor: 'white',
		fontSize: '0.9em',
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
		backgroundColor: 'black',
		width: '100%',
		height : '3px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		overflow: 'hidden',
	},

	bottom: {
		backgroundColor: 'black',
		width: '100%',
		height : '3px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		overflow: 'hidden',
	},

	params: {
		overflow: 'hidden',
		padding: '10px', 
		backgroundColor: 'white',		
	},
};

const NodeContainer = observer(class NodeContainer extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.state = {
			active: false,
			expanded: false,
			dragging: false,
		};
	}

	handleClick = () => {		
		this.setState(prevState => ({
			...prevState,
			active: !prevState.active
		}));
	}

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			expanded: !prevState.expanded
		}));
	}

	handleDrag(e) {
		// console.log('handleDrag', e);
	}

	handleDragStart(e) {
		// console.log('handleStart', e);
		this.setState({ dragging: true });

		this.handleClick();
	}

	handleDragStop(e) {
		// console.log('handleStop', e);
		this.setState({ dragging: false });
	}

	render() {
		const store = this.context.store;
		const { data } = this.props;
		console.log(data);

		style.params = {
			...style.params,
			display: this.state.expanded ? 'block' : 'none',
			height: this.state.expanded ? 'auto' : '0%',
		}

		style.top = {
			...style.top,
			height: this.state.expanded ? '15px' : '3px',
		};

		style.bottom = {
			...style.bottom,
			height: this.state.expanded ? '15px' : '3px',
		};

		style.wrapper = {
			...style.wrapper,
			boxShadow: this.state.dragging ? '5px 5px' : this.state.active ? '3px 3px' : '0px 0px',
		};

		let inlets = [];
		let outlets = [];

		if(this.props.inlets) {
			let i = 0;
			for(let inlet of this.props.inlets) {
				inlets.push(<Inlet key={i} hint={inlet.hint} />);
			}
		}

		if(this.props.outlets) {
			let i = 0;
			for(let outlet of this.props.outlets) {
				outlets.push(<Outlet key={i} hint={outlet.hint} />);
			}
		}

		return(
			<div style={style.wrapper}>
				<div className='nodeButtons' style={style.buttons}>
					<button style={style.button} onClick={this.props.onRemove}>x</button>
	          		<button style={style.button} onClick={this.handleExpand}>{this.state.expanded ? 'v' : '>'}</button>
	          		<button style={style.button} onClick={this.handleExpand}>≡</button>
	          	</div>

	          	<div style={style.main} onClick={this.handleClick}>
	          		<div style={style.top}>						
						{inlets}						
					</div>
		            <legend style={style.legend} onClick={this.handleExpand}>{this.props.title}</legend>				           

		            <div className='params' style={style.params}>
		            	{this.props.children}	
		            </div>

		           	<div style={style.bottom}>						
						{outlets}						
					</div>  
	            </div>                
	        </div>
	    )
	}
});

export default NodeContainer;