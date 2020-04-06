import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import Inlet from './Inlet';
import Outlet from './Outlet';

const style = {
	top: {
		height: '3px',
	},

	inner: {
		maxHeight: '0px',
	},

	bottom: {
		height: '3px',
	},
};

const MiniNode = observer(class MiniNode extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.innerRef = React.createRef();

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

	handleDrag = (e) => {}

	handleDragStart = (e) => {		
		this.setState({ dragging: true });

		this.handleClick();
	}

	handleDragStop = (e) => {		
		this.setState({ dragging: false });
	}

	render() {				
		return(
			<div className="miniNode">
				<button onClick={this.props.onRemove}>x</button>	          		

				<legend>
					{this.props.title}
				</legend>				           

				<div>						
					{this.props.children}							
				</div>               
	        </div>
	    )
	}
});

export default MiniNode;