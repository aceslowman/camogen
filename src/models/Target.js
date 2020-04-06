import { observable, decorate, action } from 'mobx';
import uuidv1 from 'uuid/v1';
import Shader from './Shader';
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

export default class Target {
    uuid = uuidv1();
    active = true;
    shaders = [];
    
    // experimental
    parameter_graphs = [];
    ref = null;
    parent = null;

    constructor(parent) {    
        this.parent = parent;        
        console.log(parent);
        let p = this.parent.p5_instance;
        this.ref = p.createGraphics(
            window.innerWidth,
            window.innerHeight,
            p.WEBGL
        );

        this.generateDefault();
    }

    generateDefault() {
        this.shaders = [
            new Shader("UV", this),
            new Shader("Glyph", this),
            new Shader("ToHSV", this),
            new Shader("Wavy", this),
        ];
    }

    addShader(type, index = null) {
        let i = index ? index : this.shaders.length;
        let shader = new Shader(type);

        if(shader.parameter_graphs.length){
            this.parameter_graphs.concat(shader.parameter_graphs);
        }

        this.shaders.splice(i, 0, shader);
    }

    removeShader(shader) {
        this.shaders = this.shaders.filter((item) => item !== shader);

        // this feels like a weird pattern, but currently working
        if(this.shaders.length === 0) this.parent.removeTarget(this);           
    }

    moveShader(){

    }
}

decorate(Target, {
    uuid: observable,
    active: observable,
    shaders: observable,
    addShader: action,
    removeShader: action,
    moveShader: action,
});

createModelSchema(Target, {
    uuid: identifier(),
    active: primitive(),
    shaders: list(object(Shader)),
});