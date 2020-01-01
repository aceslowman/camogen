import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

import NodeContainer from './ui/NodeContainer';

const style = {};

const Camera = observer(class Camera extends React.Component {

	static contextType = MainContext;

	// static assemble = (pg) => {	
	// 	let instance = this.context.p5_instance;
	// 	let capture = pg.createCapture(pg.VIDEO);
	// 	capture.size(instance.width,instance.height);

	// 	return capture;
	// }

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