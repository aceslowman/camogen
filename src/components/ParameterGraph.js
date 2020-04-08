import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import Operator from './Operator';
import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    identifier,
    serialize,
    deserialize
} from "serializr"
import React from 'react';
import {
    observer
} from 'mobx-react';
import MainContext from '../MainContext';
import * as NODES from './nodes';
import Panel from './ui/Panel';

class ParameterGraphStore {
    uuid   = uuidv1();
    parent = null;
    nodes  = [];

    constructor(n = null, p) {
        if(n) this.nodes = n;   
        this.parent = p;
    }

    addNode() {}

    removeNode() {}

    update() {
        for(let i = 0; i < this.nodes.length; i++){
            this.parent.value = this.nodes[i].update(this.parent.value);
        }
    }
}

decorate(ParameterGraphStore, {
    uuid: observable,
    nodes: observable,
    addNode: action,
    removeNode: action,
});

createModelSchema(ParameterGraphStore, {
    uuid: identifier(),
    nodes: list(object(Operator)),
}, c => {    
    let p = c.parentContext.target;
    return new ParameterGraphStore(null, p);
});


class ParameterGraphComponent extends React.Component {

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
};

const store = ParameterGraphStore;
const component = observer(ParameterGraphComponent);

export {
    store,
    component
}