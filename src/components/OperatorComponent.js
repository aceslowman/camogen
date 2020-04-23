import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Node from './ui/Node';

const OperatorComponent = observer(class OperatorComponent extends React.Component {
	static contextType = MainContext;

    handleRemove = () => {}
    
    handleChange = e => {    
        this.props.data.modifier = e.target.value;
    }

	render() {
		const { data } = this.props;
		return (
            <Node 	
                mini		
				title={data.name}
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

export default OperatorComponent;