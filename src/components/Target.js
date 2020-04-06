import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';

const Target = observer(class Target extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;

		// let p = context.p5_instance;
		// this.target = p.createGraphics(window.innerWidth,window.innerHeight,p.WEBGL);

		// props.data.ref = this.target;

		if(props.data.active) this.handleActive();
	}

	handleActive = () => {		
		this.context.store.activeTarget = this.props.data;
		this.context.store.activeTarget.t = this.target;
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