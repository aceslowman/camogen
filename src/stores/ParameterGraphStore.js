import { observable, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    list,
    custom,
} from "serializr"
import * as NODES from './';

export default class ParameterGraphStore {
    @observable uuid = uuidv1();

    constructor(n = [], p) {
        this.nodes  = n;
        this.parent = p;
    }

    @action addNode(type) {
        this.nodes.push(new NODES.all[type](this).init());
    }

    @action removeNode(node) {
        this.nodes = this.nodes.filter((item) => item.uuid !== node.uuid);
    }

    @action update() {        
        let v = 0;
        
        for (let i = 0; i < this.nodes.length; i++) {
            v = this.nodes[i].update(v);// here 
        }
        
        this.parent.value = v;
    }
}

createModelSchema(ParameterGraphStore, {
    nodes: list(custom(
        (v) => ({...v, parent: null}),
        (v, c) => {
            return new NODES.all[v.name](c.target,v.modifier).init();
        },
    ))
}, c => new ParameterGraphStore(c.json.nodes, c.parentContext.target));