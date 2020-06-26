import React from 'react';
import { observable, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
} from "serializr"

export default class OperatorStore {
    @observable uuid     = uuidv1();
    @observable name     = null;
    @observable value    = null;
    @observable modifier = null;
    @observable parent   = null;
    @observable inputs   = null;

    constructor(p, mod){
        this.parent = p;
        this.modifier = mod;

        this.inputs = (
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
        this.parent.parent.graph.update();
    }

    @action init = () => this;
    @action update = () => {};
}

createModelSchema(OperatorStore, {
    name:  primitive(),
    value: primitive(),
}, c => OperatorStore(c.parentContext.target).init());