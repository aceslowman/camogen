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

export default class Operator {
    uuid  = uuidv1();
    name  = null;
    value = null;

    update = null;
}

decorate(Operator, {
    uuid:  observable,
    name:  observable,
    value: observable,
    update: action,
});

createModelSchema(Operator, {
    uuid: identifier(),
    value: primitive(),
}, c => {
    let p = c.parentContext.target;
    return new Operator();
});