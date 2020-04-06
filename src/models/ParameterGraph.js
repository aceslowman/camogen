import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
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
    id = uuidv1();
    parent = null;
    nodes = [];

    constructor(n) {
        this.nodes = n;            
    }

    addNode() {

    }

    removeNode() {

    }

    parent(p) {    
        this.parent = p;
    }

    update() {
        for(let i = 0; i < this.nodes.length; i++){
            this.parent.value = this.nodes[i].update(this.parent.value);
        }
    }
}

decorate(ParameterGraph, {
    id: observable,
    nodes: observable,
    addNode: action,
    removeNode: action,
    parent: action,
});

createModelSchema(ParameterGraph, {
    uuid: identifier(),
    // nodes: primitive(),
    // addNode: primitive(),
    // removeNode: primitive(),
    // parent: primitive(),
});