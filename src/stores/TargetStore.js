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
} from "serializr"

class TargetStore {
    uuid   = uuidv1();
    ref    = null;
    parent = null;
    active = true;

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

    addShader(type, pos = null) {
        let shader = new NODES.shaders[type](this).init();
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