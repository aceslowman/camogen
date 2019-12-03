import React from 'react';
import Draggable from 'react-draggable';

import InputGroup from '../InputGroup';
import InputFloat from '../InputFloat';

import simplex from './includes/simplex.js';

export default class GlyphShader extends React.Component {

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

    float aspect = resolution.x/resolution.y;
    vec2 uv = vTexCoord;
    uv.x *= aspect;

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

    gl_FragColor = vec4(color,1.0);
}
`;


	constructor(props) {
		super(props);

		this.state = {
			lvl: props.lvl,
			noiseScale: props.noiseScale,
			noiseStep: props.noiseStep,
			dimX: props.dimX,
			dimY: props.dimY,
			seed: props.seed
		};
	}

	render() {
		return(
			<Draggable>
				<fieldset style={{marginBottom:'15px'}} >
		          <small>
		            <legend> lvl {this.state.lvl} </legend>
		            <InputGroup name='noise'>
		              <InputFloat 
		                val={this.state.noiseScale} 
		                step="0.1" 
		                name="scale"
		                onChange={(v) => this.props.updateParameter(this.state.lvl,'noiseScale',v)}
		              />
		              <InputFloat 
		                val={this.state.noiseStep} 
		                step="1" 
		                name="step"
		                onChange={(v) => this.props.updateParameter(this.state.lvl,'noiseStep',v)}
		              />
		            </InputGroup>

		            <InputGroup name='dimensions'>
		              <InputFloat 
		                val={this.state.dimX} 
		                step="1" 
		                name="x"
		                onChange={(v) => this.props.updateParameter(this.state.lvl,'dimX',v)}
		              />
		              <InputFloat 
		                val={this.state.dimY} 
		                step="1" 
		                name="y"
		                onChange={(v) => this.props.updateParameter(this.state.lvl,'dimY',v)}
		              />
		            </InputGroup>
		              <InputFloat 
		                val={this.state.seed} 
		                step="1" 
		                name="seed"
		                onChange={(v) => this.props.updateParameter(this.state.lvl,'seed',v)}
		              />
		          </small>
		        </fieldset>
			</Draggable>
	    )
	}
}