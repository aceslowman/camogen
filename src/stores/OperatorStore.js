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

export default class OperatorStore {
    uuid     = uuidv1();
    name     = null;
    value    = null;
    modifier = null;
    parent   = null;

    constructor(p, mod){
        this.parent = p;
        this.modifier = mod;
    }

    init = () => this;
    update = () => {};
}

decorate(OperatorStore, {
    // uuid:   observable,
    name:   observable,
    value:  observable,
    init:   action,
    update: action,
});

createModelSchema(OperatorStore, {
    // uuid:  identifier(),
    name:  primitive(),
    value: primitive(),
}, c => OperatorStore(c.parentContext.target).init());