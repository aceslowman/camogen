import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';
import Shader from './ShaderComponent';

const TargetComponent = observer(class TargetComponent extends React.Component {
	static contextType = MainContext;

	handleActive = () => {		
		this.store.activeTarget = this.props.data;		
	}

	handleRemove = () => {
		this.store.removeTarget(this.props.data);
	}

	render() {	
		const { data } = this.props;

		this.store = this.context.store;

		return(
			<Panel 
				title={"Target"}
				active={this.store.activeTarget === this.target}
				onRemove={this.handleRemove}
				onActive={this.handleActive}	
			>
				{data.shaders.map((shader)=>{                        
					return (
						<Shader 
							key={shader.uuid}
							data={shader}								
						/>
					);                     
				})}
			</Panel>
	    )
	}
});

export default TargetComponent;