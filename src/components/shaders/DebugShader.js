import React from 'react';
import Draggable from 'react-draggable';

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

    constructor() {
        super();

        this.state = {


        };
    }

    render() {
        return(
            <Draggable>
                <fieldset style={{marginBottom:'15px'}}>
                    <h1>debug shader</h1>
                </fieldset>
            </Draggable>            
        )
    }
}
