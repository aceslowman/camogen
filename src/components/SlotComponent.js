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
		const { label } = this.props;

		this.store = this.context.store;

		return(
			<div className="slot" style={style}>                
				{
					this.props.children 
						? (this.props.children) 
						: (<label>{label ? label : 'EMPTY SLOT'}</label>)
				}
            </div>
	    );
	}
});

export default SlotComponent; 