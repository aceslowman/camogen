import simplex from './includes/simplex';
import {createModelSchema} from "serializr"
import Parameter from '../ParameterStore';
import Uniform from '../UniformStore';
import ShaderStore from '../ShaderStore';
import ParameterGraph from '../ParameterGraphStore';
import ElapsedTime from '../inputs/ElapsedTime';

import Add from '../ops/Add';
import Divide from '../ops/Divide';
// import Modulus from '../ops/Modulus';
// import Multiply from '../ops/Multiply';
// import Subtract from '../ops/Subtract';

const Glyph = class Glyph extends ShaderStore {
	name = 'Glyph';
	uniforms = [	
		new Uniform('seed', [
			new Parameter({
				name: 'seed',
				value: Math.floor(Math.random() * 1000),
			})
		]),
		new Uniform('scale', [
			new Parameter({
				name: 'x',
				value: 3.,
			}),
			new Parameter({
				name: 'y',
				value: 1.,
			})
		]),
		new Uniform('dimensions', [
			new Parameter({
				name: 'x',
				value: 100.,
			}),
			new Parameter({
				name: 'y',
				value: 200.,
			})
		]),
		new Uniform('padding', [
			new Parameter({
				name: 'x',
				value: 0.1,
			}),
			new Parameter({
				name: 'y',
				value: 0.1,
			})
		]),
		new Uniform('offset', [
			new Parameter({
				name: 'x',
				value: 0.0,
				graph: new ParameterGraph([
					new ElapsedTime(),
					new Divide(100),
					new Add(0),
				// 	new Subtract(0),
				// 	new Multiply(1),
				// 	new Modulus(100),
				]),
			}),
			new Parameter({
				name: 'y',
				value: 0.0,
				graph: new ParameterGraph([
					new ElapsedTime(),
					new Divide(100),
					new Add(0)
				]),
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

	frag = simplex + `
		varying vec2 vTexCoord;

		uniform sampler2D tex0;
		uniform vec2 resolution;
		uniform vec2 dimensions;
		uniform vec2 scale;
		uniform vec2 padding; 
		uniform vec2 offset;

		vec2 gridCoordinates(vec2 uv, vec2 dim) {
		    // not sure why dim-1.
		    vec2 g = floor(uv * dim) / (dim-1.);

		    return g;
		}

		vec2 modCoordinates(vec2 uv, vec2 dim) {
		    float s_x = mod(uv.x, 1.0 / dim.x)/(1.0/dim.x);
		    float s_y = mod(uv.y, 1.0 / dim.y)/(1.0/dim.y);

		    return vec2(s_x,s_y);
		}

		float linearPosition(vec2 uv, vec2 dim){
			float x_pos = mod(uv.x,1.0/dim.x);
			float y_pos = mod(uv.y,1.0/dim.y);

			return x_pos;
		}

		void main() {
		    vec3 color = vec3(0.0);
		    vec4 src = texture2D(tex0, vTexCoord);
		    
		    vec2 m_grid = modCoordinates(src.rg,dimensions);
		    vec2 grid = gridCoordinates(m_grid,dimensions);
		    float seed = linearPosition(src.rg,dimensions);

		    float n = snoise(vec3((grid+offset)*scale,seed));    

			color = vec3(n);
			// color = vec3(grid,0.0);

		    gl_FragColor = vec4(color,1.0);
		}
	`;
};

createModelSchema(Glyph, {
	extends: ShaderStore
}, (c) => {
	let p = c.parentContext ? c.parentContext.target : null;
	console.log('Glyph store factory', p)
	return new Glyph(p);
});

export default Glyph;
