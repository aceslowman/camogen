import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

let style = {
	borderColor: 'white'
};

const SlotComponent = observer(class SlotComponent extends React.Component {
	static contextType = MainContext;

	constructor(){
		super();

		this.state = {
			
		}
	}

	handleClick = () => {
		if (this.props.data.graph.activeNode)
			this.props.data.graph.activeNode.deselect();
		this.props.data.select();
	}	

	render() {	
		const { label, hidden, data } = this.props;

		this.store = this.context.store;

		style = {						
			...style,
			border: data.selected ? '1px solid #39FF14' : '1px dashed white',			
		} 

		return(
			<div 
				className="slot" 
				style={!hidden ? style : {}}
				onClick={this.handleClick}
			> 
				{!hidden && (
					<label>{label ? label : 'EMPTY SLOT'}</label>               				
				)}
				{this.props.children}
            </div>
	    );
	}
});

export default SlotComponent; 