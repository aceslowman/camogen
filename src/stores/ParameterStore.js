import { observable, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
  createModelSchema,
  primitive,
  object,
} from "serializr"
import ParameterGraph from './ParameterGraphStore';

export default class ParameterStore {
    uuid = uuidv1();

    constructor(
        name = "",
        value = null, 
        graph = new ParameterGraph(),        
    ) {
        this.name = name;
        this.value = value;
        this.graph = graph;
        this.graph.parent = this;
    }
}

decorate(ParameterStore, {
    // uuid: observable,
    name: observable,
    value: observable,
    graph: observable,
});

createModelSchema(ParameterStore, {
    // uuid: identifier(),
    name: primitive(),
    value: primitive(),
    graph: object(ParameterGraph),
}, c => {    
    let param = new ParameterStore(
        c.json.name,
        c.json.value,
        c.json.graph
    );  
        
    param.parent = c.parentContext.target;
    return param;
});