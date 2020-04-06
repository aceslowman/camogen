import {observable, decorate} from 'mobx';
import Parameter from './Parameter';
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

export default class Page {
    // width and height measured in inches
    width = new Parameter({
        name: 'width',
        value: 8.5,
    });

    height = new Parameter({
        name: 'height',
        value: 14,
    });

    isSingle = new Parameter({
        name: 'isSingle',
        value: false,
    });

    isPortrait = new Parameter({
        name: 'isPortrait',
        value: false,
    });

    marginTop = new Parameter({
        name: 'marginTop',
        value: (459 / 16) * 2,
    });
    
    marginBottom = new Parameter({
        name: 'marginBottom',
        value: (459 / 16) * 3,
    });

    marginLeft = new Parameter({
        name: 'marginLeft',
        value: (459 / 16) * 5,
    });

    marginRight = new Parameter({
        name: 'marginRight',
        value: (459 / 16) * 1,
    });
    
    dpi = new Parameter({
        name: 'dpi',
        value: 300,
    });

    count = new Parameter({
        name: 'page count',
        value: 64,
    });
}

decorate(Page, {
    marginTop: observable,
    marginBottom: observable,
    marginLeft: observable,
    marginRight: observable,
    width: observable,
    height: observable,
    isSingle: observable,
    isPortrait: observable,
    dpi: observable,
    count: observable,
});

createModelSchema(Page, {
    marginTop: primitive(),
    marginBottom: primitive(),
    marginLeft: primitive(),
    marginRight: primitive(),
    width: primitive(),
    height: primitive(),
    isSingle: primitive(),
    isPortrait: primitive(),
    dpi: primitive(),
    count: primitive(),
});