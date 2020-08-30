import { observable } from 'mobx';
import {
    getDefaultModelSchema, 
    serializable,
    primitive,
} from "serializr"
import NodeStore from './NodeStore';

export default class OperatorStore extends NodeStore {
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
    extends: getDefaultModelSchema(NodeStore),// maybe try creating custom type for NodeData
    props: getDefaultModelSchema(OperatorStore).props
}