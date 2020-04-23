import {
    observable,
    decorate
} from 'mobx';
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
import ParameterStore from './ParameterStore';

export default class UniformStore {
    uuid = uuidv1();
    name = "";
    elements = [];

    constructor(name, elements) {    
        this.name = name;
        this.elements = elements
    }
}

decorate(UniformStore, {
    uuid: observable,
    name: observable,
    elements: observable,
});

createModelSchema(UniformStore, {
    uuid: identifier(),
    name: primitive(),
    elements: list(object(ParameterStore)),
});