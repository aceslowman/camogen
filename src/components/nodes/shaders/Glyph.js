import simplex from './includes/simplex';
import ParameterData from '../../../stores/ParameterData';

const Glyph = {
	name: 'Glyph',
	uniforms: [
		new ParameterData({
			name: 'seed',
			value: Math.floor(Math.random() * 1000),
		}),
		new ParameterData({
			name: 'scale',
			value: [1.,1.],
		}),
		new ParameterData({
			name: 'dimensions',
			value: [200,200],
		}),	
		new ParameterData({
			name: 'padding',
			value: [0.1, 0.1],
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

		uniform sampler2D tex0;
		uniform vec2 resolution;
		uniform vec2 dimensions;
		uniform vec2 scale;
		uniform vec2 padding; 

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

		    float n = snoise(vec3(grid*scale,seed));    

			color = vec3(n);
			// color = vec3(grid,0.0);

		    gl_FragColor = vec4(color,1.0);
		}
	`
};

export default Glyph;
