import React from 'react';
import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
} from "serializr"

export default class OperatorStore {
    uuid     = uuidv1();
    name     = null;
    value    = null;
    modifier = null;
    parent   = null;
    inputs   = null;

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

    handleChange = e => {
        this.modifier = Number(e.target.value);
        this.parent.parent.graph.update();
    }

    init = () => this;
    update = () => {};
}

decorate(OperatorStore, {    
    name:    observable,
    value:   observable,
    inputs:  observable,
    init:    action,
    update:  action,
});

createModelSchema(OperatorStore, {
    name:  primitive(),
    value: primitive(),
}, c => OperatorStore(c.parentContext.target).init());