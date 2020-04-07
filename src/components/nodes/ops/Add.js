import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
import MainContext from '../../../MainContext';
import Node from '../../ui/Node';

//----------------------------------------------------------------------
const store = class AddStore {
	base_type = "Add";
    value = 0;
	modifier = 0;
	
	constructor(v) {	
		this.modifier = v;
	}

	update(v) {		
        return Number(v) + Number(this.modifier);
	}
}

decorate(store, {
	base_type: observable,
    value: observable,
    modifier: observable,
	update: action,		
});

//----------------------------------------------------------------------
const node = observer(class Add extends React.Component {
	static contextType = MainContext;

    handleRemove = () => {}
    
    handleChange = e => {    
        this.props.data.modifier = e.target.value;
    }

	render() {
		const { data } = this.props;
		return (
			<Node 
				title="+"
				data={data} 
				onRemove={this.handleRemove}
			>	
				<input 
					type="number"
                    value={data.modifier}	
                    onChange={this.handleChange}			
				/>				
			</Node>
		);
	}
});

export { store, node };