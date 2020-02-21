import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

import NodeContainer from './ui/NodeContainer';

const style = {};

const Camera = observer(class Camera extends React.Component {

	static contextType = MainContext;

	constructor(props, context) {
		super(props);
		let pg = context.p5_instance;
		this.capture = pg.createCapture(pg.VIDEO);
		this.capture.size(pg.width,pg.height);
	}

	render() {
		return(
			<NodeContainer 
				title={"Camera"}
			>
			</NodeContainer>
	    )
	}
});

export default Camera;