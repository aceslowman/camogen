import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

let style = {
	wrapper: {
		borderColor: 'white',
		// backgroundColor: 'black'
	},
	rail: {
		width: '2px',
		height: '10px'
	}	
};

const SlotComponent = observer(class SlotComponent extends React.Component {
	static contextType = MainContext;
	ref = React.createRef();
	
	constructor() {
		super();

		this.innerRef = React.createRef();

		this.state = {
			rerender: false,			
		};
	}

	handleClick = () => {
		if (this.props.data.graph.activeNode)
			this.props.data.graph.activeNode.deselect();
		this.props.data.select();
	}	

	componentDidMount() {
		this.setState(prevState=>({
			...prevState,
			rerender: prevState.rerender
		}))
	}

	render() {	
		const { label, hidden, data } = this.props;

		this.store = this.context.store;

		style.wrapper = {						
			...style.wrapper,
			border: data.selected ? '1px solid #39FF14' : '1px dashed white',			
		} 

		let branch_colors = ['red','blue','green','purple']

		if(this.ref.current) {
			let bounds = this.ref.current.getBoundingClientRect();
			let color = data.branch_index !== null ? branch_colors[data.branch_index] : 'gray';
			let bottom_rail_right = false;
			let bottom_rail_left = false;
			let width, height;
			let offset_left = 0;
			let stroke_width = 3;

			if (data.children[0] && data.children[0].parents.length > 1) {
				stroke_width = 6;
				bottom_rail_left = data.children[0].parents.indexOf(data) > 0;
				bottom_rail_right = data.children[0].parents.indexOf(data) < data.children[0].parents.length-1;

				if (bottom_rail_right) {
					width = bounds.width / 2;
					offset_left = bounds.width / 4 - 3;
				}

				if (bottom_rail_left) {
					width = bounds.width / 2;
					offset_left = -bounds.width / 4 - 3;
				}
			}
		
			height = !hidden ? (bounds.height + (bounds.height / 4)) : 0;
			
			style.rail = {
				...style.rail,
				// border: '3px dashed ' + color,
				width: width+'px',
				height: height+'px',
				borderStyle: 'dashed dashed dashed dashed',
				borderWidth: stroke_width+'px',
				borderColor: color,
				borderTop: 'none',
				borderRight: bottom_rail_right ? 'none' : stroke_width+'px dashed '+color,
				borderLeft: bottom_rail_left ? 'none' : stroke_width+'px dashed ' + color,
				// borderBottom: 'none',She is
				marginLeft: offset_left+'px',
			}
		}		
		
		return(
			<div 
				className="slot" 
				style={!hidden ? style.wrapper : {}}
				onClick={this.handleClick}
				ref={this.ref}
			> 				
				{!hidden && (
					<label>{label ? label : 'EMPTY SLOT'}</label>               				
				)}
				{this.props.children}
				<div 
					className="graph_rail"
					// style={!hidden ? style.rail : {}}
				></div>
            </div>
	    );
	}
});

export default SlotComponent; 