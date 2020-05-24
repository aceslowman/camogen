import { observable, action, decorate } from 'mobx';
import Shader from './ShaderStore';
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
    shaders = [];

    constructor(parent) {
        this.parent = parent;

        let p = this.parent.p5_instance;
        this.ref = p.createGraphics(
            window.innerWidth,
            window.innerHeight,
            p.WEBGL
        );
    }

    assignShader(shader) {
        if(this.shaders.includes(shader)) {
            console.log(shader.name + ' can be recycled')

        } else {
            console.log(shader.name + ' CANT be recycled')
            this.shaders.push(shader);
        }
    }

    removeShader(shader) {
        this.shaders = this.shaders.filter((item) => item.uuid !== shader.uuid);                

        shader.inputs.forEach((e) => {
            e.disconnect();
        });

        shader.outputs.forEach((e)=>{
            e.disconnect();
        });

        if (this.shaders.length === 0) this.parent.removeTarget(this);
    }
}

decorate(TargetStore, {
    uuid:         observable,
    active:       observable,
    shaders:      observable,
    assignShader:    action,
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