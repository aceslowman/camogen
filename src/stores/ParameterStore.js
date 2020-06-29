import { observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
  createModelSchema,
  primitive,
//   object,
  identifier
} from "serializr";
import ParameterGraph from './ParameterGraphStore';

export default class ParameterStore {
    @observable uuid = uuidv1();
    @observable value = null;
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

createModelSchema(ParameterStore, {
    uuid: identifier(),
    name: primitive(),
    value: primitive()
}, c => {    
    let param = new ParameterStore(
        c.json.name,
        c.json.value,
        c.json.graph
    );  
        
    param.parent = c.parentContext.target;
    return param;
});