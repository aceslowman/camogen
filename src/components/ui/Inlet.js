import React from 'react';

import { observer } from 'mobx-react';

const style = {
	inlet : {
		minWidth: '10px',
		height: '13px',
		borderTop: '1px solid black',
		borderBottom: '1px solid black',
		backgroundColor: 'white',
		// zIndex: '99',
		fontSize: '0.9em',
		// float: 'left',
		display: 'flex',
		flexDirection: 'row',
	},

	inletIcon: {
		height: '13px',
		width: '13px',
		backgroundColor: 'white',
		// borderRight: '1px solid black',
		boxSizing: 'border-box',
	},

	hint: {
		padding: '0px 2px',
		// color: 'white',
		// backgroundColor: 'black',
	},
};

const Inlet = observer(class Inlet extends React.Component {

	constructor() {
		super();

		this.state = {};		
	}

	render() {
		// const store = this.props.store;
		// const node = store.nodes.byId[this.props.node_id];

		return(
			<div style={style.inlet}>
				{/*<div style={style.inletIcon}></div>*/}
				<div style={style.hint}>{this.props.hint}</div>
			</div>
	    )
	}
});

export default Inlet;