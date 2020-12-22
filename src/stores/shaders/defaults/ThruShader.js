const vert = "attribute vec3 aPosition; \n" +
"attribute vec2 aTexCoord; \n" +
"varying vec2 vTexCoord; \n\n" +
"void main() {  \n" +
"   vTexCoord = aTexCoord; \n" + 
"   vec4 positionVec4 = vec4(aPosition, 1.0); \n" + 
"   positionVec4.xy = positionVec4.xy * vec2(1., -1.); \n" + 
"   gl_Position = positionVec4; \n" + 
"}";

const frag = "varying vec2 vTexCoord; \n" +
"uniform sampler2D tex0; \n" + // causing black screen error?
"uniform vec2 resolution; \n\n" +
"void main() { \n" +
"   vec4 color = texture2D(tex0, vTexCoord); \n" +
"   gl_FragColor = color; \n" +
"} \n";

const precision = "#ifdef GL_ES \n" +
"   precision highp float; \n" +
"#endif \n";

export {vert, frag, precision}
