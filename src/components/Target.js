import React from 'react';
import Draggable from 'react-draggable';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

const style = {
	wrapper: {
		padding: '0px',
		border: '1px dashed white',
		margin: '15px',
	},
	legend: {
		color: 'white',
		backgroundColor: 'black', 
		border: '1px solid white',
		marginLeft: '7px'
	}
};

const Target = observer(class Target extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;

		let p = context.p5_instance;
		this.target = p.createGraphics(window.innerWidth,window.innerHeight,p.WEBGL);

		props.data.ref = this.target;

		if(props.data.active) this.makeActive();
	}

	makeActive = () => {
		this.context.store.activeTarget = this.target;
	}

	render() {
		style.legend = {
			...style.legend,
			color: this.context.store.activeTarget === this.target ? 'black' : 'white',
			backgroundColor: this.context.store.activeTarget === this.target ? 'white' : 'black',
		}

		return(
			<Draggable>
				<fieldset style={style.wrapper}>
					<legend style={style.legend} onClick={this.makeActive}>target</legend>
					{React.Children.map(this.props.children, child =>
     					React.cloneElement(child, { target: this.props.data })
    				)}
				</fieldset>
			</Draggable>
	    )
	}
});

export default Target;