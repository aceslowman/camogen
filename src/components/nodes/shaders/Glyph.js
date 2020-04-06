import simplex from './includes/simplex';
import Parameter from '../../../models/Parameter';
import ParameterGraph from '../../../models/ParameterGraph';
import { store as ElapsedTime } from '../inputs/ElapsedTime';
import { store as Add } from '../ops/Add';
import { store as Divide } from '../ops/Divide';
import { store as Subtract } from '../ops/Subtract';
import { store as Multiply } from '../ops/Multiply';
import { store as Modulus } from '../ops/Modulus';

/* 
	This format can be used to store all configurations and settings
	 for a user-defined shader. Shader.js is built to parse these
	  documents.
*/

const Glyph = {
	name: 'Glyph',
	uniforms: [
		new Parameter({
			name: 'seed',
			value: Math.floor(Math.random() * 1000),
		}),
		{
			name: 'scale',
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
		{
			name: 'dimensions',
			elements: [
				new Parameter({
					name: 'x',
					value: 100.,
				}),
				new Parameter({
					name: 'y',
					value: 200.,
				})
			],
		},
		{
			name: 'padding',
			elements: [
				new Parameter({
					name: 'x',
					value: 0.1,
				}),
				new Parameter({
					name: 'y',
					value: 0.1,
				})
			],
		},
		{
			name: 'offset',
			elements: [
				new Parameter({
					name: 'x',
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
				new Parameter({
					name: 'y',
					value: 0.0,
					graph: new ParameterGraph([
						new ElapsedTime(),
						new Divide(100),
						new Add(0)
					]),
				}),
			],
		},				
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
	`
};

export default Glyph;
