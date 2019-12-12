import React from 'react';
import ShaderNode from './ShaderNode';

const style = {};

export default class DebugShader extends React.Component {

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

    static frag = ()  => this.precision() + `
    varying vec2 vTexCoord;

    uniform sampler2D tex0;

    void main() {
        vec3 color = vec3(0.0);
        vec4 src = texture2D(tex0,vTexCoord);

        if(vTexCoord.x < 1./4.) {
            color = vec3(src.r);
        } else if (vTexCoord.x > 1./4. && vTexCoord.x < 2./4.) {
            color = vec3(src.g);
        } else if (vTexCoord.x > 2./4. && vTexCoord.x < 3./4.) {
            color = vec3(src.b);
        } else if (vTexCoord.x > 3./4. && vTexCoord.x < 1.) {
            color = vec3(src.a);
        }

        gl_FragColor = vec4(color,1.0);
    }
    `;

    render() {
        const store = this.props.store;
        const node = store.nodes.byId[this.props.node_id];

        return(
            <ShaderNode title={"DebugShader"} node_id={this.props.node_id} store={store}>
                <legend style={style.legend}>DebugShader</legend>                
            </ShaderNode>          
        )
    }
}
