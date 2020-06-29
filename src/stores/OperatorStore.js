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

        this.controls.push(
            <input 
                key={this.uuid}
                type="number"
                defaultValue={this.modifier}                
                onChange={this.handleChange}			
            />
        );
    }

    @action handleChange = e => {
        this.modifier = Number(e.target.value);
        this.node.graph.update();
    }
}

createModelSchema(OperatorStore, {
    extends: NodeDataStore
});