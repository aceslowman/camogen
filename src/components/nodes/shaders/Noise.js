import simplex from './includes/simplex';
import ParameterData from '../../../stores/ParameterData';
// import ElapsedTime from '../data/ElapsedTime';

const Noise = {
	name: 'Noise',
	uniforms: [
		new ParameterData({
			name: 'offset',
			value: [0.0,0.0],
		}),
		new ParameterData({
			name: 'seed',
			value: Math.floor(Math.random() * 1000),
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
	frag: simplex + `
		varying vec2 vTexCoord;

		uniform vec2 offset;
		uniform float seed;		

		void main() {
		    vec3 color = vec3(0.0);

		    float n = snoise(vec3(vec2(vTexCoord.x+offset.x,vTexCoord.y+offset.y),seed));    

		    color = vec3(n);

		    gl_FragColor = vec4(color,1.0);
		}
	`
};

export default Noise;
