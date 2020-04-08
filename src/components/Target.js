import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate, action } from 'mobx';
import MainContext from '../MainContext';
import Panel from './ui/Panel';
import uuidv1 from 'uuid/v1';
import * as Shader from './Shader';
import {
    createModelSchema,
    primitive,    
    list,
    object,
    identifier,
} from "serializr"

class TargetStore {
    uuid    = uuidv1();
    ref     = null;
    parent  = null;
    active  = true;
    shaders = [];

    constructor(parent) {    
        this.parent = parent;

        let p = this.parent.p5_instance;
        this.ref = p.createGraphics(
            window.innerWidth,
            window.innerHeight,
            p.WEBGL
        );

        if (this.active) this.parent.activeTarget = this; 
    }

    generateDefault() {
        this.shaders = [
            new Shader.store("UV", this),
            new Shader.store("Glyph", this),
            new Shader.store("ToHSV", this),
            new Shader.store("Wavy", this),
        ];

        return this;
    }

    addShader(type, pos = null) {
        let shader = new Shader(type,this);
        this.shaders.splice(pos ? pos : this.shaders.length, 0, shader);
    }

    removeShader(shader) {
        this.shaders = this.shaders.filter((item) => item !== shader);
        if(this.shaders.length === 0) this.parent.removeTarget(this);           
    }
}

decorate(TargetStore, {
    uuid: observable,
    active: observable,
    shaders: observable,
    addShader: action,
    removeShader: action,    
});

createModelSchema(TargetStore, {
    uuid: identifier(),
    active: primitive(),
    shaders: list(object(Shader)),
}, c => {    
    let p = c.parentContext.target;
    return new TargetStore(p);
});

class TargetComponent extends React.Component {
	static contextType = MainContext;

	handleActive = () => {		
		this.context.store.activeTarget = this.props.data;		
	}

	handleRemove = () => {
		this.context.store.removeTarget(this.props.data);
	}

	render() {		
		return(
			<Panel 
				title={"Target"}
				active={this.context.store.activeTarget === this.target}
				onRemove={this.handleRemove}
				onActive={this.handleActive}	
				>
				{React.Children.map(this.props.children, child =>
					React.cloneElement(child, { target: this.props.data })
				)}
			</Panel>
	    )
	}
};

const store = TargetStore;
const component = observer(TargetComponent);

export { 
    store, 
    component 
}