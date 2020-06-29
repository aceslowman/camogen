import { observable, action } from 'mobx';
import ShaderStore from './ShaderStore';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
    list,
    object,
    identifier,
    // deserialize,
} from "serializr"

class TargetStore {
    @observable uuid   = uuidv1();
    @observable ref    = null;
    @observable parent = null;
    @observable active = true;
    @observable shaders = [];

    constructor(parent) {
        this.parent = parent;

        let p = this.parent.p5_instance;
        this.ref = p.createGraphics(
            window.innerWidth,
            window.innerHeight,
            p.WEBGL
        );
    }

    @action clear() {
        this.shaders = [];
    }

    @action assignShader(shader) {
        if(this.shaders.includes(shader)) {
            // console.log(shader.name + ' can be recycled')

        } else {
            // console.log(shader.name + ' CANT be recycled')
            this.shaders.push(shader);
        }
    }

    @action removeShader(shader) {
        this.shaders = this.shaders.filter((item) => item.uuid !== shader.uuid);                

        // if (this.shaders.length === 0) this.parent.removeTarget(this);
    }
}

createModelSchema(TargetStore, {
    uuid:    identifier(),
    active:  primitive(),
    shaders: list(object(ShaderStore)),
}, c => {
    let p = c.parentContext.target;
    console.log('Target store factory', p)
    return new TargetStore(p.parent);
});

export default TargetStore;