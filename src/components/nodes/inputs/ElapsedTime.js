import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, decorate } from 'mobx';
import MainContext from '../../../MainContext';
import MiniNode from '../../ui/MiniNode';

//----------------------------------------------------------------------
const store = class ElapsedTimeStore {
	base_type = "ElapsedTime";
	value = 0;

	update() {
		return Number(this.value++);
	}
}

decorate(store, {
	base_type: observable,
	value: observable,
	update: action,		
});

//----------------------------------------------------------------------
const node = observer(class ElapsedTime extends React.Component {
	static contextType = MainContext;

	handleRemove = () => {}

	render() {
		const { data } = this.props;
		return (
			<MiniNode 
				title="ElapsedTime"
				data={data} 
				onRemove={this.handleRemove}
			>	
				<input 
					type="number"
					value={data.value}
					readOnly
				/>				
			</MiniNode>
		);
	}
});

export { store, node };