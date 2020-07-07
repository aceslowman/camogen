import { observable, action } from 'mobx';
import uuidv1 from 'uuid/v1';

export default class TargetStore {
    @observable uuid   = uuidv1();

    @observable ref    = null;

    @observable parent = null;

    @observable shaders = [];

    @observable active = true;

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