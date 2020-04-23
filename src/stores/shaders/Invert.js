import Parameter from '../ParameterStore';
import ParameterGraph from '../ParameterGraphStore';

const Invert = {
	name: 'Invert',
	uniforms: [
        new Parameter({
            name: 'amount',
            value: 1.0,
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
    uniform float amount;

    void main() {
        vec4 src = texture2D(tex0, vTexCoord);        

        vec3 color = amount - src.rgb;

        gl_FragColor = vec4(color,src.a);
    }
	`
};

export default Invert;
