import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

const OperatorComponent = observer(class OperatorComponent extends React.Component {
	static contextType = MainContext;

    handleRemove = () => {}
    
    handleChange = e => {    
		this.props.data.modifier = e.target.value;
		this.props.graph.update();
    }

	render() {
		const { data, graph } = this.props;

		return (
            <div className="operator">
				<button onClick={()=>graph.removeNode(data)}>x</button>
				<h3>{data.name}</h3>
				<input 
					type="number"
                    value={data.modifier ? data.modifier : data.value}	
                    onChange={this.handleChange}			
				/>	
			</div>								
		);
	}
});

export default OperatorComponent;