import uuidv1 from 'uuid/v1';
import { observable } from 'mobx';
import {
    identifier,
    primitive,
    serializable,
    list,
    getDefaultModelSchema,
    reference
} from 'serializr';
import NodeStore from './NodeStore';

export default class NodeDataStore {
    // @serializable(identifier()) 
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable name = null;

    @serializable(list(primitive()))
    @observable inputs = [];

    @serializable(list(primitive()))
    @observable outputs = ["out"];

    // see workaround in constructor
    @observable node = null;

    @observable controls = [];

    constructor(node) {        
        //workaround for circular dependency
        getDefaultModelSchema(NodeDataStore).props["node"] = reference(NodeStore);
        
        this.node = node;
    }
}