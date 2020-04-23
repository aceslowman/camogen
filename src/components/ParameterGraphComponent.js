import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import OperatorComponent from './OperatorComponent';
import Panel from './ui/Panel';

const ParameterGraphComponent = observer(class ParameterGraphComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props);
		this.nodes = [];

		this.ref = React.createRef();
	}

	generateNodes() {
		this.nodes = [];

		if (!this.props.data.graph) return;
		for (let i = 0; i < this.props.data.graph.nodes.length; i++) {
			let node = this.props.data.graph.nodes[i];

			this.nodes.push((
				<OperatorComponent key={i} data={node}/>
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

export default ParameterGraphComponent;