import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

const style = {
	wrapper: {
		marginBottom:'15px', 
		backgroundColor: 'white',
		width: '230px',
		border: '1px solid black',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'stretch'
	},

	buttons: {
		// flex: '0 1 auto',
		padding: '5px',
		// backgroundColor: 'red',
		// width: '50px',
		display: 'flex',
		flexDirection: 'column',
		// float: 'left',
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

	remove: {
		// float: 'left',
		// padding: '5px 10px',
		// position: 'absolute',
		// top: '0px',
		// left: '0px',
	},

	expand: {
		// float: 'left',

	},

	legend: {		
		fontWeight: 'bold',
		// marginBottom: '10px',
		// backgroundColor: 'orange',
		fontSize: '1.6em'
	},

	inlets: {
		width: '100%',
		listStyle: 'none',
		margin: '0px',
		padding: '0px',
		// backgroundColor: 'yellow',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-start',
		fontFamily: 'sans-serif',
	},

	hints: {
		width: '100%',
		listStyle: 'none',
		margin: '0px',
		padding: '0px',
		// backgroundColor: 'yellow',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-start',
	},

	top: {
		// position: 'relative',
		// bottom: '16px'
	},

	bottom: {
		// position: 'relative',
		// top: '21px',
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
			expanded: false
		};
	}

	handleExpand() {
		this.setState(prevState => ({
			...prevState,
			expanded: !prevState.expanded
		}));
	}

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		style.params = {
			...style.params,
			display: this.state.expanded ? 'block' : 'none',
			height: this.state.expanded ? 'auto' : '0%',
		}

		return(
			<Draggable>
				<div style={style.wrapper} >
					
						{/*<div style={style.top}>
							<ul style={style.inlets}>
								<li><span role="img" aria-label="something">◾︎</span></li>
								<li><span role="img" aria-label="something">◽︎</span></li>
								<li><span role="img" aria-label="something">◽︎</span></li>
								<li><span role="img" aria-label="something">◾︎</span></li>
							</ul>		
							<ul style={style.hints}>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li>4</li>
							</ul>
						</div>*/}

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

			           	{/*<div style={style.bottom}>
			           		<ul style={style.hints}>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li>4</li>
							</ul>
							<ul style={style.inlets}>
								<li><span role="img" aria-label="something">◾︎</span></li>
								<li><span role="img" aria-label="something">◽︎</span></li>
								<li><span role="img" aria-label="something">◽︎</span></li>
								<li><span role="img" aria-label="something">◾︎</span></li>
							</ul>		
						</div> */}           
			         
		        </div>
			</Draggable>
	    )
	}
});

export default NodeContainer;