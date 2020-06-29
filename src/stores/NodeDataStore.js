import uuidv1 from 'uuid/v1';
import { observable, action } from 'mobx';
import { createModelSchema, identifier, primitive, list } from 'serializr';

export default class NodeDataStore {
    @observable uuid = uuidv1();
    @observable name = null;

    @observable node = null;

    @observable inputs = [];
    @observable outputs = ["out"];

    @observable controls = [];

    constructor(node) {
        this.node = node;
    }
}

createModelSchema(NodeDataStore, {
    uuid: identifier(),
    name: primitive(),
    inputs: list(primitive()),
    outputs: list(primitive()),
});