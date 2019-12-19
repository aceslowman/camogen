import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../../../MainContext';

import InputGroup from '../../input/InputGroup';
import InputFloat from '../../input/InputFloat';
import InputBool from '../../input/InputBool';

import simplex from './includes/simplex.js';

import NodeContainer from '../../ui/NodeContainer';

const style = {};

const GlyphShader = observer(class GlyphShader extends React.Component {

	static contextType = MainContext;

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
	`;

	static assemble = (pg) => {		
		let shader = pg.createShader(this.vert(), this.frag());

		return shader;
	}

	render() {
		const store = this.context.store;
		const node = this.props.node;

		return(
			<NodeContainer 
				title={"GlyphShader"} 
				node={this.props.node} 
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