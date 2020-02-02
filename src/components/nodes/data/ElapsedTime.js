import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../../MainContext';
import NodeContainer from '../../ui/NodeContainer';

const ElapsedTime = observer(class ElapsedTime extends React.Component {

	static contextType = MainContext;

	handleRemove = () => {

	}

	render() {
		const { data } = this.props;
		return (
			<NodeContainer 
				title="ElapsedTime"
				data={data} 
				onRemove={this.handleRemove}
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>					
			</NodeContainer>
		);
	}
});

export default ElapsedTime;