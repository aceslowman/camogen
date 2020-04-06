import Parameter from '../../../models/Parameter';
import ParameterGraph from '../../../models/ParameterGraph';
import { store as ElapsedTime } from '../inputs/ElapsedTime';
import { store as Add } from '../ops/Add';
import { store as Divide } from '../ops/Divide';
import { store as Subtract } from '../ops/Subtract';
import { store as Multiply } from '../ops/Multiply';
import { store as Modulus } from '../ops/Modulus';

// https://github.com/Sophia-Gold/WebGL-Convolution-Shaders/blob/master/convolution.glsl.js

const Sharpen = {
	name: 'Sharpen',
	uniforms: [
        {
            name: 'resolution',
            elements: [
                new Parameter({
                    name: 'x',
                    value: 3.,
                }),
                new Parameter({
                    name: 'y',
                    value: 1.,
                })
            ],
        },
        new Parameter({
            name: 'width',
            value: 1.,
        })
    ],  
	precision: `
		#ifdef GL_ES
		precision highp float;
		#endif 
	`,
	vert: `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    uniform vec2 resolution;
    uniform float width;
    varying vec2 texcoord11;
    varying vec2 texcoord00;
    varying vec2 texcoord02;
    varying vec2 texcoord20;
    varying vec2 texcoord22;
    void main() {
        gl_Position = vec4(((aPosition.xy / resolution) * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
        texcoord11 = aTexCoord;
        texcoord00 = aTexCoord + vec2(-width, -width);
        texcoord02 = aTexCoord + vec2(width, -width);
        texcoord20 = aTexCoord + vec2(width, width);
        texcoord22 = aTexCoord + vec2(-width, width);
    }
	`,
	frag: `
    varying vec2 texcoord11;
    varying vec2 texcoord00;
    varying vec2 texcoord02;
    varying vec2 texcoord20;
    varying vec2 texcoord22;

    uniform sampler2D tex0;

    void main() {	
        vec4 s11 = texture2D(tex0, texcoord11);
        vec4 s00 = texture2D(tex0, texcoord00);
        vec4 s02 = texture2D(tex0, texcoord02);
        vec4 s20 = texture2D(tex0, texcoord20);
        vec4 s22 = texture2D(tex0, texcoord22);
        
        vec4 sharp = 5.0 * s11 - (s00 + s02 + s20 + s22);
        gl_FragColor = sharp;
    }
	`
};

export default Sharpen;
