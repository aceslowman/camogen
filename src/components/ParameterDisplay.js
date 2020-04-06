import React from 'react';
import Draggable from 'react-draggable';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import * as NODES from './nodes';
import Panel from './ui/Panel';

const ParameterDisplay = observer(class ParameterDisplay extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props);
		this.nodes = [];

		this.ref = React.createRef();
	}

	generateNodes() {
		// render is being called too often IMPORTANT
		this.nodes = [];

		if (!this.props.data.graph) return;
		for (let i = 0; i < this.props.data.graph.nodes.length; i++) {
			let node = this.props.data.graph.nodes[i];

			console.log(NODES);
			// is there anything better to do here?			
			let NodeComponent = NODES.all[node.base_type].node;			
			
			this.nodes.push((
				<NodeComponent key={i} data={node}/>
			));
		}
	}

	handleClickAway = e => {
		if (!this.ref.current.contains(e.target)) {
			this.context.store.activeParameter = null;
			document.removeEventListener('click', this.handleClickAway);
		}
	}

	componentDidMount() {				
		this.generateNodes();
	}

	render() {
		const { data } = this.props;
		
		return(
			<Panel 
				title={"Parameter"} 
				onClickAway={this.handleClickAway}
				onRef={this.ref}
			>
				{this.nodes}
				<input
					readOnly
					style={{
						width: '70px',
						marginTop: '15px',
						justifyContent: 'center',
					}}
					type="number"
					value={data.value}
				/>
			</Panel>							
	    )
	}
});

export default ParameterDisplay;