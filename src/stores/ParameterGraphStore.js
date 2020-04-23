import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import Operator from './OperatorStore';
import {
    createModelSchema,
    list,
    object,
    identifier,
} from "serializr"

export default class ParameterGraphStore {
    uuid = uuidv1();
    parent = null;
    nodes = [];

    constructor(n, p) {
        this.nodes  = n;
        this.parent = p;
    }

    addNode() {}

    removeNode() {}

    update() {        
        for (let i = 0; i < this.nodes.length; i++) {
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
    return new ParameterGraphStore(c.json.nodes, p);
});