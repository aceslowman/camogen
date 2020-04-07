import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';

const Target = observer(class Target extends React.Component {

	static contextType = MainContext;

	handleActive = () => {		
		this.context.store.activeTarget = this.props.data;		
	}

	handleRemove = () => {
		this.context.store.removeTarget(this.props.data);
	}

	render() {		
		return(
			<Panel 
				title={"Target"}
				active={this.context.store.activeTarget === this.target}
				onRemove={this.handleRemove}
				onActive={this.handleActive}	
				>
				{React.Children.map(this.props.children, child =>
					React.cloneElement(child, { target: this.props.data })
				)}
			</Panel>
	    )
	}
});

export default Target;