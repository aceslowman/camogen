import React from 'react';

import { observer } from 'mobx-react';

import InputGroup from '../InputGroup';
import InputFloat from '../InputFloat';

import simplex from './includes/simplex.js';

import NodeContainer from './NodeContainer';

const style = {};

const GlyphShader = observer(class GlyphShader extends React.Component {

	static precision = () => `
	#ifdef GL_ES
	precision highp float;
	#endif 
	`;

	static vert = () => this.precision() + `
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

	static frag = () => this.precision() + simplex + `
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

	    float aspect = resolution.y/resolution.x;
	    vec2 uv = vTexCoord * vec2(1.0,aspect);

	    vec2 grid;
	    vec2 m_grid;

	    if(level == 0) {
	        // create base uv layer for first level
	        m_grid = modCoordinates(uv,dimensions);
	        grid = gridCoordinates(m_grid,dimensions);
	    } else {
	        m_grid = modCoordinates(src.rg,dimensions);
	        grid = gridCoordinates(src.rg,dimensions);
	    }

	    float seed = src.b;

	    float n = snoise(vec3(grid,seed));    

	    color = vec3(n);
	    // color = vec3(uv.x,uv.y/,1.0);

	    gl_FragColor = vec4(color,1.0);
	}
	`;

	static assemble = (pg) => {		
		let shader = pg.createShader(this.vert(), this.frag());

		return shader;
	}

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		return(
			<NodeContainer 
				title={"GlyphShader"} 
				node_id={this.props.node_id} 
				store={store}
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>	            
	            <InputGroup name='noise'>
	              <InputFloat 
	                val={node.uniforms.noiseScale} 
	                step="0.1" 
	                name="scale"
	                onChange={(v) => node.uniforms.noiseScale = v }
	              />
	              <InputFloat 
	                val={node.uniforms.noiseStep} 
	                step="1" 
	                name="step"
	                onChange={(v) => node.uniforms.noiseStep = v }
	              />
	            </InputGroup>
	            
	            <InputGroup name='dimensions'>
	              <InputFloat 
	                val={node.uniforms.dimensions[0]} 
	                step="1" 
	                name="x"
	                onChange={(v) => node.uniforms.dimensions[0] = v }
	              />
	              <InputFloat 
	                val={node.uniforms.dimensions[1]} 
	                step="1" 
	                name="y"
	                onChange={(v) => node.uniforms.dimensions[1] = v }
	              />
	            </InputGroup>
	            
	            <InputFloat 
	                val={node.uniforms.seed} 
	                step="1" 
	                name="seed"
	                onChange={(v) => node.uniforms.seed = v }
	            />
			</NodeContainer>          		
	    )
	}
});

export default GlyphShader;