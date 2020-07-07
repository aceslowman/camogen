import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
  getDefaultModelSchema,
  primitive,
  object,
  reference,
  identifier,
  serializable,
  deserialize
} from "serializr";
import ParameterGraphStore from './ParameterGraphStore';
import GraphStore from './GraphStore';

export default class ParameterStore {
    @serializable(identifier()) 
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable value = null;
    
    @serializable(object(ParameterGraphStore.schema))
    @observable graph = null;
    
    // see note in constructor
    @observable parent = null;

    constructor(
        name = "",
        value = null, 
        graph = new ParameterGraphStore(),
    ) {
        // getDefaultModelSchema(ParameterStore).props["parent"] = reference(GraphStore.schema);
        this.name = name;
        this.value = value;
        this.graph = graph;
    }
}

ParameterStore.schema = {
    factory: c => {
        // console.log(c)
        let param = new ParameterStore(
            c.json.name,
            c.json.value,
            deserialize(ParameterGraphStore.schema, c.json.graph)
        );

        return param;
    }, 
    props: getDefaultModelSchema(ParameterStore).props
}