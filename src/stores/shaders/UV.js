import {
    createModelSchema,
    createSimpleSchema,
} from "serializr"
import Parameter from '../ParameterStore';
import Uniform from '../UniformStore';
import ShaderStore from '../ShaderStore';

const UV = class UV extends ShaderStore {
	name = 'UV';
	uniforms = [
        new Uniform('bSquare', [
            new Parameter({
                name: 'bSquare',
                value: true,
            }),
        ]),        
    ];

	precision = `
		#ifdef GL_ES
		precision highp float;
		#endif 
    `;
    
	vert = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition,1.0);
        positionVec4.xy = positionVec4.xy * vec2(1.,-1.);
        gl_Position = positionVec4;
    }
    `;
    
	frag = `
    varying vec2 vTexCoord;
    uniform sampler2D tex0;
    uniform vec2 resolution;
    uniform bool bSquare;
    void main() {
        vec3 color = vec3(0.0);
        float aspect = resolution.y/resolution.x;
        vec2 uv = vTexCoord;
        if(bSquare) {
            uv.y *= aspect;	    
        }
        gl_FragColor = vec4(uv.x,uv.y,1.0,1.0);
    }
	`;
};

createModelSchema(UV, {
    extends: ShaderStore
}, (c) => {
    let p = c.parentContext ? c.parentContext.target : c.args.target;
    console.log('UV store factory', p)
    return new UV(p).init();
});

export default UV;
