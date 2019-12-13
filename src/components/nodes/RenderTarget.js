import React from 'react';
import NodeContainer from './NodeContainer';

import { observer } from 'mobx-react';

import InputGroup from '../InputGroup';
import InputFloat from '../InputFloat';
import InputBool from '../InputBool';

const style = {};

const RenderTarget = observer(class RenderTarget extends React.Component {

	static assemble = (pg) => {		
		return {};
	}

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		return(
			<NodeContainer title={"RenderTarget"} node_id={this.props.node_id} store={store}>
	            <InputGroup name='default'>		              
	              
	            </InputGroup>
	        </NodeContainer>
	    )
	}
});

export default RenderTarget;