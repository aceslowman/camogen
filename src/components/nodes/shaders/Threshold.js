import ParameterData from '../../../stores/ParameterData';

const Threshold = {
	name: 'Threshold',
	uniforms: [
        new ParameterData({
            name: 'low',
            value: 0.0,
        }),
        new ParameterData({
            name: 'high',
            value: 1.0,
        }),
        new ParameterData({
            name: 'invert',
            value: false,
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
    uniform float low;
    uniform float high;
    uniform bool b_invert;

    // https://github.com/hughsk/glsl-luma/blob/master/index.glsl
    float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
    }

    float luma(vec4 color) {
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
    }

    void main() {
        vec4 src = texture2D(tex0, vTexCoord);        
        
        bool thresh = (luma(src) > low) && (luma(src) < high);

        vec3 color = vec3(0.0);

        if(thresh){
            color = vec3(1.0);
        }

        gl_FragColor = vec4(color.rgb,src.a);
    }
	`
};

export default Threshold;
