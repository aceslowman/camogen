const vert = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;

    void main() { 
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * vec2(1., -1.);
        gl_Position = positionVec4;     
    }
`;
const frag = `
    varying vec2 vTexCoord;
    uniform sampler2D tex0;
    uniform vec2 resolution;
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
`;
const precision = `
    #ifdef GL_ES
    precision highp float;
    #endif"
`;

export {vert, frag, precision}
