import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

const OperatorComponent = observer(class OperatorComponent extends React.Component {
	static contextType = MainContext;

    handleRemove = () => {}
    
    handleChange = e => {    
		this.props.data.modifier = Number(e.target.value);
		this.props.graph.update();
	}
	
	componentDidUpdate(){
		console.log('component did update')
	}

	render() {
		const { data, graph } = this.props;

		console.log('rendering',data.inputs)

		return (
            <div className="operator">
				<button onClick={()=>graph.removeNode(data)}>x</button>
				<h3>{data.name}</h3>
				{data.inputs}				
			</div>								
		);
	}
});

export default OperatorComponent;