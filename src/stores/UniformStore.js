import uuidv1 from 'uuid/v1';
import {
    observable,
    decorate
} from 'mobx';
import {
    createModelSchema,
    primitive,
    list,
    object,
} from "serializr"
import ParameterStore from './ParameterStore';

export default class UniformStore {
    uuid = uuidv1();

    constructor(name = "", elements = [], p) {    
        this.name = name;
        this.elements = elements;
        this.parent = p;
        this.elements.forEach((e)=>{
            e.parent = this;
        })
    }
}

decorate(UniformStore, {
    // uuid: observable,
    name: observable,
    elements: observable,
    parent: observable,
});

createModelSchema(UniformStore, {
    // uuid: identifier(),
    name: primitive(),
    elements: list(object(ParameterStore)),
}, c => {
    return new UniformStore(c.json.name, c.json.elements, c.parentContext.target)
    }
);