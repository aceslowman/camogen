import React from 'react';
import { observable, action } from 'mobx';
import {
    createModelSchema
} from "serializr"
import NodeDataStore from './NodeDataStore';

export default class OperatorStore extends NodeDataStore {
    @observable value    = null;
    @observable modifier = null;
    @observable controls   = [];

    constructor(node, mod = null){
        super(node);

        this.modifier = mod;
    }  
}

createModelSchema(OperatorStore, {
    extends: NodeDataStore
});