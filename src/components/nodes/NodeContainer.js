import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

const style = {
	remove: {
		float: 'left',
		padding: '5px 10px',
		position: 'absolute',
		top: '0px',
		left: '0px',
	},

	legend: {		
		fontWeight: 'bold',
		marginBottom: '10px',
		fontSize: '1.6em'
	},

	fieldset: {
		marginBottom:'15px', 
		backgroundColor: 'white',
		width: '230px'
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
		position: 'relative',
		bottom: '16px'
	},

	bottom: {
		position: 'relative',
		top: '21px',
	},
};

const NodeContainer = observer(class NodeContainer extends React.Component {

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		return(
			<Draggable>
				<fieldset style={style.fieldset} >
					<small>
						<div style={style.top}>
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
						</div>									
			          	<a style={style.remove} onClick={() => store.removeNode(this.props.node_id)}>x</a>
			            <legend style={style.legend}>{this.props.title}</legend>

			            {this.props.children}	

			           	<div style={style.bottom}>
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
						</div>            
			         </small>
		        </fieldset>
			</Draggable>
	    )
	}
});

export default NodeContainer;