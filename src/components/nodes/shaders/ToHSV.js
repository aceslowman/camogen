import Parameter from '../../../models/Parameter';

const ToHSV = {
	name: '2HSV',
	uniforms: [
        new Parameter({
            name: 'scale',
            value: 1.0,
        }),
        new Parameter({
            name: 'rotation',
            value: 1.0,
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
	frag: `
    varying vec2 vTexCoord;
    uniform sampler2D tex0;
    uniform vec2 resolution;
    
    uniform float scale;
    uniform float rotation;

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        vec4 c = texture2D(tex0, vTexCoord);

        vec3 hsv = scale * c.rgb;        

        gl_FragColor = vec4(hsv2rgb(hsv + vec3(rotation, 0., 0.)), 1.0);
    }
	`
};

export default ToHSV;
