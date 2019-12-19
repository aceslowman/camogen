import simplex from './includes/simplex';

const Glyph = {
	name: 'Glyph',
	uniforms: {
      seed: Math.floor(Math.random() * 1000),
      noiseScale: 0.1,
      noiseStep: 8,
      dimensions: [20,20]
    },  
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
		uniform int level; 
		// uniform float seed;

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

		void main() {
		    vec3 color = vec3(0.0);
		    vec4 src = texture2D(tex0, vTexCoord);

		    vec2 grid;
		    vec2 m_grid;
		    
		    m_grid = modCoordinates(src.rg,dimensions);
		    grid = gridCoordinates(m_grid,dimensions);

		    float seed = src.b;

		    float n = snoise(vec3(grid,seed));    

		    color = vec3(n);
		    // color =	vec3(1.0,src.r,src.g);
		    // color = vec3(src.rgb/0.2);
		    // color = vec3(uv.x,uv.y/,1.0);

		    gl_FragColor = vec4(color,1.0);
		}
	`
};

export default Glyph;
