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
    uuid  = uuidv1();
    name  = null;
    value = null;

    update = () => {};
}

decorate(OperatorStore, {
    uuid:   observable,
    name:   observable,
    value:  observable,
    update: action,
});

createModelSchema(OperatorStore, {
    uuid:  identifier(),
    name:  primitive(),
    value: primitive(),
}, c => {
    let p = c.parentContext.target;
    return new OperatorStore();
});