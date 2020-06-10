import { decorate, observable } from "mobx";
import ShaderStore from "../ShaderStore";

class ImageInput extends ShaderStore{
    name = "IMAGE";
    img = null;

    constructor(
        target = null,
        img = null,
    ) {
        super(
            target,
            `
            #ifdef GL_ES
            precision highp float;
            #endif 
            `,
            `attribute vec3 aPosition;
            attribute vec2 aTexCoord;
            varying vec2 vTexCoord;
            void main() {
                vTexCoord = aTexCoord;
                vec4 positionVec4 = vec4(aPosition, 1.0);
                positionVec4.xy = positionVec4.xy * vec2(1., -1.);
                gl_Position = positionVec4;
            }`,
            `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform vec2 img_dimensions;
            uniform bool bSquare;
            uniform sampler2D tex0;
            void main() {                
                vec3 color = vec3(0.0);
                float aspect = img_dimensions.x / img_dimensions.y;
                vec2 uv = vTexCoord;
                // if (bSquare) {
                    uv.y *= aspect;
                // }
                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`,
        );
        
        this.img = img;

        console.log('Image Input')
    }

    // extending
    init() {
        this.parameter_graphs = [];
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        );

        this.extractUniforms();

        for (let uniform of this.uniforms) {
            this.ref.setUniform(uniform.name, uniform.elements);

            for (let param of uniform.elements) {
                if (param.graph)
                    this.parameter_graphs.push(param.graph)
            }
        }

        console.log(this.target.parent.p5_instance)
        let p = this.target.parent.p5_instance;

        // obtain image
        // this.img = p.loadImage('images/horse_run.jpg');
        this.img = p.loadImage('images/muybridge.jpg');
        console.log(this.img)

        return this;
    }

    // extending
    update(p) {
        // let p = this.target.parent.p5_instance;

        let shader = this.ref;
        let target = this.target.ref;

        /* 
            Loop through all active parameter graphs to recompute 
            values in sync with the frame rate
        */
        for (let op of this.operatorUpdateGroup) {
            op.update();
            op.parent.update();
        }

        for (let uniform_data of this.uniforms) {
            if (uniform_data.elements.length > 1) {

                // there should be a more elegant way of doing this
                let elements = [];

                for (let element of uniform_data.elements) {
                    elements.push(element.value);
                }

                shader.setUniform(uniform_data.name, elements);
            } else {
                shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
            }
        }

        shader.setUniform('tex0',this.img);
        shader.setUniform('resolution', [target.width, target.height]);
        shader.setUniform('img_dimensions', [this.img.width, this.img.height]);
        


        // target.image(this.img,0,0,this.img.width/4,this.img.height/4);

        target.shader(shader);

        try {
            target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        } catch (error) {
            console.error(error);
            console.log('frag', shader)
            p.noLoop();
        }
    }
}

decorate(ImageInput, {
    uuid: observable,
    name: observable,
    target: observable,
    img: observable,
    node: observable,
})

export default ImageInput;