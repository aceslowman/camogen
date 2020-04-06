import Parameter from '../../../models/Parameter';
import ParameterGraph from '../../../models/ParameterGraph';
import { store as ElapsedTime } from '../inputs/ElapsedTime';
import { store as Add } from '../ops/Add';
import { store as Divide } from '../ops/Divide';
import { store as Subtract } from '../ops/Subtract';
import { store as Multiply } from '../ops/Multiply';
import { store as Modulus } from '../ops/Modulus';

const Wavy = {
	name: 'Wavy',
	uniforms: [
        new Parameter({
            name: 'scale',
            value: 0.0001,
        }),
        new Parameter({
            name: 'frequency',
            value: 2000.0,
        }),
        new Parameter({
            name: 'time',
            value: 0.0,
            graph: new ParameterGraph([
                new ElapsedTime(),
                new Divide(100),
                new Add(0),
                new Subtract(0),
                new Multiply(1),
                new Modulus(100),
            ]),
        }),
    ],  
	precision: `
		#ifdef GL_ES
		precision highp float;
		#endif 
	`,
	vert: `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition,1.0);
        positionVec4.xy = positionVec4.xy * vec2(1.,-1.);
        gl_Position = positionVec4;
    }
	`,
	frag: `
    varying vec2 vTexCoord;
    uniform sampler2D tex0;
    uniform vec2 resolution;
    
    uniform float scale;
    uniform float frequency;
    uniform float time;

    void main() {
        vec2 uv = vTexCoord / resolution;

        uv.y +=  sin(time + (uv.x * frequency)) * scale;

        vec4 c = texture2D(tex0, resolution * uv);

        gl_FragColor = c;
    }
	`
};

export default Wavy;
