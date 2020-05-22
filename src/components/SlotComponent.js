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

	render() {	
		const { label, hidden } = this.props;

		this.store = this.context.store;

		style = {						
			...style,
			border: hidden ? 'none' : '1px dashed white',
		}

		return(
			<div className="slot" style={!hidden ? style : {}}> 
			{!hidden && (
				<label>{label ? label : 'EMPTY SLOT'}</label>               				
			)}
			{this.props.children}
            </div>
	    );
	}
});

export default SlotComponent; 