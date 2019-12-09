import React from 'react';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';

import InputGroup from '../../InputGroup';
import InputFloat from '../../InputFloat';
import InputBool from '../../InputBool';

const UVGenerator = observer(class UVGenerator extends React.Component {

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

	static frag = () => this.precision() + `
	varying vec2 vTexCoord;

	uniform sampler2D tex0;
	uniform vec2 resolution;
	uniform bool bSquare;

	void main() {
	    vec3 color = vec3(0.0);

	    float aspect = resolution.y/resolution.x;
	    vec2 uv = vTexCoord;

	    if(bSquare) {
			uv.y *= aspect;	    
	    }

	    gl_FragColor = vec4(uv.x,uv.y,1.0,1.0);
	}
	`;

	render() {
		const store = this.props.store;
		const node = store.nodes.byId[this.props.node_id];

		return(
			<Draggable>
				<fieldset style={{marginBottom:'15px'}} >
		          <small>
		            <legend>UVGenerator</legend>
		            <InputGroup name='default'>		              
		              <InputBool 
		                val={node.uniforms.bSquare} 
		                name="square"
		                onChange={(v) => node.uniforms.bSquare = v }
		              />
		            </InputGroup>
		            <button onClick={() => store.removeNode(this.props.node_id)}>remove</button>
		          </small>
		        </fieldset>
			</Draggable>
	    )
	}
});

export default UVGenerator;