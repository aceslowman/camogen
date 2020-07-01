import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
  createModelSchema,
  getDefaultModelSchema,
  primitive,
  object,
  identifier,
  serializable
} from "serializr";
import ParameterGraph from './ParameterGraphStore';
import NodeDataStore from './NodeDataStore';
import GraphStore from './GraphStore';

export default class ParameterStore {
    @serializable(identifier()) 
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable value = null;
    
    @serializable(object(GraphStore))
    @observable graph = null;
    
    @observable parent = null;

    constructor(
        name = "",
        value = null, 
        graph = new ParameterGraph(this),        
    ) {
        this.name = name;
        this.value = value;
        this.graph = graph;
    }
}

ParameterStore.schema = {
    factory: c => {
        let param = new ParameterStore(
            c.json.name,
            c.json.value,
            c.json.graph
        );

        param.parent = c.parentContext.target;
        return param;
    },
    extends: getDefaultModelSchema(NodeDataStore), 
    props: getDefaultModelSchema(ParameterStore).props
}