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

export default class ParameterGraph {
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

decorate(ParameterGraph, {
    uuid: observable,
    nodes: observable,
    addNode: action,
    removeNode: action,
});

createModelSchema(ParameterGraph, {
    uuid: identifier(),
    nodes: list(object(Operator)),
}, c => {    
    let p = c.parentContext.target;
    return new ParameterGraph(null, p);
});