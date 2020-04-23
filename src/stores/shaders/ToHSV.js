import { createModelSchema } from "serializr"
import Parameter from '../ParameterStore';
import Uniform from '../UniformStore';
import ShaderStore from '../ShaderStore';

const ToHSV = class ToHSV extends ShaderStore {
	name = '2HSV';
	uniforms = [
        new Uniform('scale', [
            new Parameter({
                name: 'scale',
                value: 1.0,
            })
        ]),
        new Uniform('rotation', [
            new Parameter({
                name: 'rotation',
                value: 1.0,
            })
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
    
    uniform float scale;
    uniform float rotation;

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        vec4 c = texture2D(tex0, vTexCoord);

        vec3 hsv = scale * c.rgb;        

        gl_FragColor = vec4(hsv2rgb(hsv + vec3(rotation, 0., 0.)), 1.0);
    }
	`
};

createModelSchema(ToHSV, {
    extends: ShaderStore
}, (c) => {
    let p = c.parentContext ? c.parentContext.target : null;
    console.log('ToHSV store factory', p)
    return new ToHSV(p);
});

export default ToHSV;
