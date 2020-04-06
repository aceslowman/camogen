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

const Node = observer(class Node extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.innerRef = React.createRef();

		this.state = {
			expanded: false,
			dragging: false,
		};
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
		
		if (this.innerRef.current) {
			style.inner = {
				...style.inner,
				maxHeight: this.state.expanded ? this.innerRef.current.scrollHeight + 'px' : '0px', 
			}
		}		

		// style.top = {
		// 	...style.top,
		// 	height: this.state.expanded ? '15px' : '3px',
		// };

		// style.bottom = {
		// 	...style.bottom,
		// 	height: this.state.expanded ? '15px' : '3px',
		// };

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
			<div className="node">
				<div className='nodeButtons'>
					<button onClick={this.props.onRemove}>x</button>
	          		<button onClick={this.handleExpand}>{this.state.expanded ? 'v' : '>'}</button>
	          		<button onClick={""}>≡</button>
					<button onClick={this.props.onSave}>s</button>
					<button onClick={this.props.onLoad}>l</button>
	          	</div>

	          	<div className='nodeContainerMain' onClick={this.handleClick}>
	          		{/* <div className='nodeContainerTop' style={style.top}>						
						{inlets}						
					</div> */}
					
		            <legend onClick={this.handleExpand}>
						{this.props.title}
					</legend>				           

		            <div className='nodeContainerInner' style={style.inner} ref={this.innerRef}>
						<div className='nodeContainerInnerFix' >
							{this.props.children}	
						</div>		            	
		            </div>

		           	{/* <div className='nodeContainerBottom' style={style.bottom}>						
						{outlets}						
					</div>   */}
	            </div>                
	        </div>
	    )
	}
});

export default Node;