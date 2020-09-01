import { observable } from 'mobx';
import {
    getDefaultModelSchema, 
    serializable,
    primitive,
} from "serializr"
import NodeDataStore from './NodeDataStore';

export default class OperatorStore extends NodeDataStore {
    @observable value    = null;

    @serializable(primitive())
    @observable modifier = null;

    constructor(node, mod = null){
        super(node);

        this.modifier = mod;
    }  
}

OperatorStore.schema = {
    factory: c => {
        let parent_node = c.args ? c.args.node : null
        console.log(parent_node)
        return new OperatorStore(
            parent_node            
        );
    },
    extends: getDefaultModelSchema(NodeDataStore),// maybe try creating custom type for NodeData
    props: getDefaultModelSchema(OperatorStore).props
}