import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
import MainContext from '../../../MainContext';
import MiniNode from '../../ui/MiniNode';

//----------------------------------------------------------------------
const store = class ModulusStore {
	base_type = "Modulus";
    value = 0;
	modifier = 1;
	
	constructor(v) {
		this.modifier = v;
	}

	update(v) {		
        return Number(v) % Number(this.modifier);
	}
}

decorate(store, {
	base_type: observable,
    value: observable,
    modifier: observable,
	update: action,		
});

//----------------------------------------------------------------------
const node = observer(class Modulus extends React.Component {
	static contextType = MainContext;

    handleRemove = () => {}
    
    handleChange = e => {    
        this.props.data.modifier = e.target.value;
    }

	render() {
		const { data } = this.props;
		return (
			<MiniNode 				
				title="%"
				data={data} 
				onRemove={this.handleRemove}
			>	
				<input 
					type="number"
                    value={data.modifier}	
                    onChange={this.handleChange}			
				/>				
			</MiniNode>
		);
	}
});

export { store, node };