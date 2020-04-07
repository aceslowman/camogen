import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import Shader from './Shader';
import {
    createModelSchema,
    primitive,    
    list,
    object,
    identifier,
} from "serializr"

export default class Target {
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
            new Shader("UV", this),
            new Shader("Glyph", this),
            new Shader("ToHSV", this),
            new Shader("Wavy", this),
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

decorate(Target, {
    uuid: observable,
    active: observable,
    shaders: observable,
    addShader: action,
    removeShader: action,    
});

createModelSchema(Target, {
    uuid: identifier(),
    active: primitive(),
    shaders: list(object(Shader)),
}, c => {    
    let p = c.parentContext.target;
    return new Target(p);
});