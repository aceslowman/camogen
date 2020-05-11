import uuidv1 from 'uuid/v1';
import {
    observable,
    decorate
} from 'mobx';
import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    identifier,
} from "serializr"
import ParameterStore from './ParameterStore';

export default class UniformStore {
    uuid = uuidv1();

    constructor(name = "", elements = []) {    
        this.name = name;
        this.elements = elements;
        this.elements.forEach((e)=>{
            e.parent = this;
        })
    }
}

decorate(UniformStore, {
    // uuid: observable,
    name: observable,
    elements: observable,
});

createModelSchema(UniformStore, {
    // uuid: identifier(),
    name: primitive(),
    elements: list(object(ParameterStore)),
}, c => new UniformStore(c.json.name, c.json.elements));