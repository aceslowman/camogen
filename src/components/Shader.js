import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../../../MainContext';

import NodeContainer from '../../ui/NodeContainer';

const style = {};

const Shader = observer(class Shader extends React.Component {

	static contextType = MainContext;

	static assemble = (pg) => {		
		return pg.createShader(this.vert(), this.frag());
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

export default Shader;