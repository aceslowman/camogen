import { observable, action, decorate } from 'mobx';
import Shader from './ShaderStore';
import * as NODES from './';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
    list,
    object,
    identifier,
    deserialize,
} from "serializr"
import ShaderStore from './ShaderStore';

class TargetStore {
    uuid   = uuidv1();
    ref    = null;
    parent = null;
    active = true;

    bounds = null;

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

    moveShader(shader, destination) {
        let index = this.shaders.findIndex((item) => item.uuid === shader.uuid);
        // console.log(index) 
    }

    addShader(type = null, pos = null) {
        let shader;

        if(type){
            shader = deserialize(ShaderStore, NODES.shaders[type], ()=>{}, {target: this}).init();      
        }else{
            shader = new ShaderStore(this).init();
        }
        
        this.shaders.splice(pos ? pos : this.shaders.length, 0, shader);
    }

    removeShader(shader) {
        this.shaders = this.shaders.filter((item) => item.uuid !== shader.uuid);
        if (this.shaders.length === 0) this.parent.removeTarget(this);
    }
}

decorate(TargetStore, {
    uuid:         observable,
    active:       observable,
    shaders:      observable,
    addShader:    action,
    removeShader: action,
});

createModelSchema(TargetStore, {
    uuid:    identifier(),
    active:  primitive(),
    shaders: list(object(Shader)),
}, c => {
    let p = c.parentContext.target;
    console.log('Target store factory', p)
    return new TargetStore(p);
});

export default TargetStore;