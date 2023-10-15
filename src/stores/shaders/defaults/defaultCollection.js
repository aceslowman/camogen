export default {
  "id": "default-collection_u2TVZ3vU1gFAx8I450Yfu",
  "path": "/app/shaders",
  "name": "shaders",
  "size": 36387,
  "type": "directory",
  "children": [
    {
      "id": "k9U-GY0DiSgl9XRFKpblr",
      "path": "/app/shaders/Color",
      "name": "Color",
      "size": 2257,
      "type": "directory",
      "children": [
        {
          "id": "yQzLNRWY30s1ImQVJzZWA",
          "path": "/app/shaders/Color/HSV2RGB",
          "name": "HSV2RGB",
          "size": 1030,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "HSV2RGB",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "\n    attribute vec3 aPosition;\n    attribute vec2 aTexCoord;\n    varying vec2 vTexCoord;\n    void main() {\n        vTexCoord = aTexCoord;\n        vec4 positionVec4 = vec4(aPosition,1.0);\n        positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n        gl_Position = positionVec4;\n    }\n\t",
            "frag": "\n    varying vec2 vTexCoord;\n    uniform sampler2D tex0;\n    uniform vec2 resolution;\n    \n    uniform float scale;\n    uniform float rotation;\n\n    vec3 hsv2rgb(vec3 c) {\n        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n    }\n\n    void main() {\n        vec4 c = texture2D(tex0, vTexCoord);\n\n        vec3 hsv = scale * c.rgb;        \n\n        gl_FragColor = vec4(hsv2rgb(hsv + vec3(rotation, 0., 0.)), 1.0);\n    }\n\t",
            "updateGroup": {}
          }
        },
        {
          "id": "YmeykwG0VZleoNzUwstBK",
          "path": "/app/shaders/Color/RGB2HSV",
          "name": "RGB2HSV",
          "size": 1227,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "RGB2HSV",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n    gl_Position = positionVec4;\n}\n\t",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\nuniform vec3 scale;\nuniform vec3 rotation; //{'default': [0,0,0]}\n\n// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl\n// All components are in the range [0…1], including hue.\nvec3 rgb2hsv(vec3 c) {\n    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n    float d = q.x - min(q.w, q.y);\n    float e = 1.0e-10;\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nvoid main() {\n    vec4 c = texture2D(tex0, vTexCoord);\n\n    vec3 rgb = scale * c.rgb;        \n\n    gl_FragColor = vec4(rgb2hsv(rgb + rotation), 1.0);\n}\n",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "nQA6rrqxRYjj1yZ2Dtuvc",
      "path": "/app/shaders/Default",
      "name": "Default",
      "size": 565,
      "type": "file",
      "extension": "",
      "data": {
        "type": "Shader",
        "name": "Default",
        "inputs": [],
        "outputs": ["out"],
        "uniforms": [],
        "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
        "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
        "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \n\nvoid main() {        \n    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);    \n}",
        "updateGroup": {}
      }
    },
    {
      "id": "pJjFsRzSFLz1_DxcSQ1El",
      "path": "/app/shaders/Effects",
      "name": "Effects",
      "size": 9454,
      "type": "directory",
      "children": [
        {
          "id": "Uzpa0FtU6chiIaqoL1UzC",
          "path": "/app/shaders/Effects/Displace",
          "name": "Displace",
          "size": 857,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Displace",
            "inputs": ["tex0", "tex1"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \n\nuniform sampler2D tex0;\nuniform sampler2D tex1;\n\nuniform vec2 amount; //{'default':[0.5,0.5]}\n\nvoid main() {  \n  vec2 uv = vTexCoord;\n  \n  vec4 dist = texture2D(tex1, uv);\n  \n  uv.x += dist.r * amount.x;\n  uv.y += dist.g * amount.y;\n  \n  vec4 src = texture2D(tex0, uv);\n  gl_FragColor = vec4(src.rgb, 1.0);    \n}",
            "updateGroup": {}
          }
        },
        {
          "id": "2pQx-TKt7ksiC57Lt4iVw",
          "path": "/app/shaders/Effects/Glyph",
          "name": "Glyph",
          "size": 6597,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Glyph",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n\t",
            "frag": "\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x * 34.0) + 1.0) * x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v) {\n    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n    // First corner\n    vec3 i = floor(v + dot(v, C.yyy));\n    vec3 x0 = v - i + dot(i, C.xxx);\n\n    // Other corners\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min(g.xyz, l.zxy);\n    vec3 i2 = max(g.xyz, l.zxy);\n\n    //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n    //   x1 = x0 - i1  + 1.0 * C.xxx;\n    //   x2 = x0 - i2  + 2.0 * C.xxx;\n    //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n    vec3 x1 = x0 - i1 + C.xxx;\n    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n    vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y\n\n    // Permutations\n    i = mod289(i);\n    vec4 p = permute(permute(permute(\n                i.z + vec4(0.0, i1.z, i2.z, 1.0)) +\n            i.y + vec4(0.0, i1.y, i2.y, 1.0)) +\n        i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n    // Gradients: 7x7 points over a square, mapped onto an octahedron.\n    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n    float n_ = 0.142857142857; // 1.0/7.0\n    vec3 ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,7*7)\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)\n\n    vec4 x = x_ * ns.x + ns.yyyy;\n    vec4 y = y_ * ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4(x.xy, y.xy);\n    vec4 b1 = vec4(x.zw, y.zw);\n\n    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n    vec4 s0 = floor(b0) * 2.0 + 1.0;\n    vec4 s1 = floor(b1) * 2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n    vec3 p0 = vec3(a0.xy, h.x);\n    vec3 p1 = vec3(a0.zw, h.y);\n    vec3 p2 = vec3(a1.xy, h.z);\n    vec3 p3 = vec3(a1.zw, h.w);\n\n    //Normalise gradients\n    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n    // Mix final noise value\n    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),\n        dot(p2, x2), dot(p3, x3)));\n}\n\nvec2 mod289(vec2 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n    return mod289(((x * 34.0) + 1.0) * x);\n}\n\nfloat snoise(vec2 v) {\n    const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0\n        0.366025403784439, // 0.5*(sqrt(3.0)-1.0)\n        -0.577350269189626, // -1.0 + 2.0 * C.x\n        0.024390243902439); // 1.0 / 41.0\n    // First corner\n    vec2 i = floor(v + dot(v, C.yy));\n    vec2 x0 = v - i + dot(i, C.xx);\n\n    // Other corners\n    vec2 i1;\n    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n    //i1.y = 1.0 - i1.x;\n    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n    // x0 = x0 - 0.0 + 0.0 * C.xx ;\n    // x1 = x0 - i1 + 1.0 * C.xx ;\n    // x2 = x0 - 1.0 + 2.0 * C.xx ;\n    vec4 x12 = x0.xyxy + C.xxzz;\n    x12.xy -= i1;\n\n    // Permutations\n    i = mod289(i); // Avoid truncation effects in permutation\n    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) +\n        i.x + vec3(0.0, i1.x, 1.0));\n\n    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n    m = m * m;\n    m = m * m;\n\n    // Gradients: 41 points uniformly over a line, mapped onto a diamond.\n    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n    vec3 x = 2.0 * fract(p * C.www) - 1.0;\n    vec3 h = abs(x) - 0.5;\n    vec3 ox = floor(x + 0.5);\n    vec3 a0 = x - ox;\n\n    // Normalise gradients implicitly by scaling m\n    // Approximation of: m *= inversesqrt( a0*a0 + h*h );\n    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);\n\n    // Compute final noise value at P\n    vec3 g;\n    g.x = a0.x * x0.x + h.x * x0.y;\n    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n    return 130.0 * dot(m, g);\n}\n\n\t\tvarying vec2 vTexCoord;\n\n\t\tuniform sampler2D tex0;\n\t\tuniform vec2 resolution; // {\"name\":\"sys\"}\n\t\tuniform vec2 dimensions; // {\"name\":\"dim\",\"default\":[100.0,100.0]}\n\t\tuniform vec2 scale; \t // {\"name\":\"sc\",\"default\":[3,1],\"type\": \"slider\"}\n\t\tuniform vec2 offset;     // {\"name\":\"off\",\"default\":[0.0,0.0]}\n\n\t\tvec2 gridCoordinates(vec2 uv, vec2 dim) {\n\t\t    // not sure why dim-1.\n\t\t    vec2 g = floor(uv * dim) / (dim-1.);\n\n\t\t    return g;\n\t\t}\n\n\t\tvec2 modCoordinates(vec2 uv, vec2 dim) {\n\t\t    float s_x = mod(uv.x, 1.0 / dim.x)/(1.0/dim.x);\n\t\t    float s_y = mod(uv.y, 1.0 / dim.y)/(1.0/dim.y);\n\n\t\t    return vec2(s_x,s_y);\n\t\t}\n\n\t\tfloat linearPosition(vec2 uv, vec2 dim){\n\t\t\tfloat x_pos = mod(uv.x,1.0/dim.x);\n\t\t\tfloat y_pos = mod(uv.y,1.0/dim.y);\n\n\t\t\treturn x_pos;\n\t\t}\n\n\t\tvoid main() {\n\t\t    vec3 color = vec3(0.0);\n\t\t    vec4 src = texture2D(tex0, vTexCoord);\n\t\t    \n\t\t    vec2 m_grid = modCoordinates(src.rg,dimensions);\n\t\t    vec2 grid = gridCoordinates(m_grid,dimensions);\n\t\t    float seed = linearPosition(src.rg,dimensions);\n\n\t\t    float n = snoise(vec3((grid+offset)*scale,seed));    \n\n\t\t\tcolor = vec3(n);\n\n\t\t    gl_FragColor = vec4(color,1.0);\n\t\t}\n\t",
            "updateGroup": {}
          }
        },
        {
          "id": "v9mBfKHu-uGPQM4f75TJx",
          "path": "/app/shaders/Effects/Lumakey",
          "name": "Lumakey",
          "size": 1222,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Lumakey",
            "inputs": ["tex0", "tex1"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform sampler2D tex1;\nuniform float threshold; // {'default': 0.5}\nuniform bool flip;\n\n// https://github.com/hughsk/glsl-luma\nfloat luma(vec3 color) {\n  \treturn dot(color, vec3(0.299, 0.587, 0.114));\n}\n\nfloat luma(vec4 color) {\n  \treturn dot(color.rgb, vec3(0.299, 0.587, 0.114));\n}\n\nvoid main() {\n    vec4 src0 = texture2D(tex0,vTexCoord);\n    vec4 src1 = texture2D(tex1,vTexCoord);\n    vec4 color = vec4(0.0);\n  \n  \tfloat brightness = luma(src1);\n  \t//brightness = smoothstep(brightness - 0.1,brightness + 0.1,0.5);\n  \n  \tif(brightness > threshold) {\n    \tcolor = flip ? src1 : src0;\n    } else {\n      \tcolor = flip ? src0 : src1;\n    }\n  \n    gl_FragColor = color;\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "9QXeT7f5By5CjY9zcmz7S",
          "path": "/app/shaders/Effects/Wavy",
          "name": "Wavy",
          "size": 778,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Wavy",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "\n\t\tattribute vec3 aPosition;\n\t\tattribute vec2 aTexCoord;\n\n\t\tvarying vec2 vTexCoord;\n\n\t\tvoid main() {\n\t\t    vTexCoord = aTexCoord;\n\n\t\t    vec4 positionVec4 = vec4(aPosition,1.0);\n\t\t    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n\t\t    gl_Position = positionVec4;\n\t\t}\n\t",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\n\nuniform float scale;\nuniform float frequency;\nuniform float time;\n\nvoid main() {\n    vec2 uv = vTexCoord;\n\n    uv.y +=  sin(time + (uv.x * frequency)) * scale;\n\n    vec4 c = texture2D(tex0, uv);\n\n    gl_FragColor = c;\n} ",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "84s1fiyDM7iAOhU54-ONH",
      "path": "/app/shaders/Generators",
      "name": "Generators",
      "size": 5500,
      "type": "directory",
      "children": [
        {
          "id": "hhbyLqE0mT3KEn6NrNIg1",
          "path": "/app/shaders/Generators/Circular",
          "name": "Circular",
          "size": 854,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Circular",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \nuniform vec2 position; // {\"default\": [0.5,0.5]}\n\n#define PI 3.1415926535897932384626433832795\n\nvoid main() {    \n    vec4 color = vec4(0.0);\n    vec2 uv = vTexCoord.xy;\n    float value = atan(uv.y - position.y, uv.x - position.x) + PI;\n    color = vec4(value/(PI*2.0));\n    // vec4 color = vec4(atan());\n    gl_FragColor = vec4(color.rgb, 1.0);    \n}",
            "updateGroup": {}
          }
        },
        {
          "id": "kBSYvhYmjexSW1UMOmzjf",
          "path": "/app/shaders/Generators/FBM",
          "name": "FBM",
          "size": 1889,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "FBM",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;\n\nuniform vec2 resolution;\nuniform vec2 scale;\nuniform vec2 offset;\nuniform float time;\nuniform int octaves;\n\n#define MAX_OCTAVES 8\n\n// from https://thebookofshaders.com/13/\nfloat random (in vec2 _st) {\n    return fract(sin(dot(_st.xy,\n                         vec2(12.9898,78.233)))*\n        43758.5453123);\n}\n\n// Based on Morgan McGuire @morgan3d\n// https://www.shadertoy.com/view/4dS3Wd\nfloat noise (in vec2 _st) {\n    vec2 i = floor(_st);\n    vec2 f = fract(_st);\n\n    // Four corners in 2D of a tile\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n\n    vec2 u = f * f * (3.0 - 2.0 * f);\n\n    return mix(a, b, u.x) +\n            (c - a)* u.y * (1.0 - u.x) +\n            (d - b) * u.x * u.y;\n}\n\nfloat fbm ( in vec2 _st) {\n    float v = 0.0;\n    float a = 0.5;\n    vec2 shift = vec2(100.0);\n    // Rotate to reduce axial bias\n    mat2 rot = mat2(cos(0.5), sin(0.5),\n                    -sin(0.5), cos(0.50));\n    for (int i = 0; i < MAX_OCTAVES; ++i) {\n      if(i < octaves) {\n        v += a * noise(_st);\n        _st = rot * _st * 2.0 + shift;\n        a *= 0.5;\n      }\n    }\n    return v;\n}\n\nvoid main() {\n  vec2 uv = vTexCoord;\n  uv.y *= resolution.y / resolution.x;\n  \n  vec4 color = vec4(fbm((uv*scale) + offset));\n\n  gl_FragColor = color;\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "Soj_K4FiO3z_IID8_oM5_",
          "path": "/app/shaders/Generators/Radial",
          "name": "Radial",
          "size": 759,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Radial",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \nuniform vec2 position; // {\"default\": [0.5,0.5]}\n\n#define PI 3.1415926535897932384626433832795\n\nvoid main() {    \n    vec4 color = vec4(0.0);\n    vec2 uv = vTexCoord.xy;\n    float value = distance(uv, position);\n    gl_FragColor = vec4(vec3(value), 1.0);    \n}",
            "updateGroup": {}
          }
        },
        {
          "id": "xGPKJLLUXQybnonYc4r3j",
          "path": "/app/shaders/Generators/SinOsc",
          "name": "SinOsc",
          "size": 1277,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "SinOsc",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n    ",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n    gl_Position = positionVec4;\n}\n    ",
            "frag": "varying vec2 vTexCoord; \nuniform vec2 resolution;\n\nuniform vec2 orientation; //{'default': [1.0,0.0]}\nuniform float frequency; //{'default': 1.0} \nuniform float offset; //{'default': 0.0}\n\nuniform vec2 range; //{'default': [-1.0,1.0]}\n\n//https://github.com/msfeldstein/glsl-map/blob/master/index.glsl\nfloat map(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvoid main() {\n  const float PI = 3.1415926538;\n  vec2 uv = vTexCoord;\n  \n  float freq = frequency * (2.0 * PI);\n  \t\n  uv.x *= orientation.x;\n  uv.y *= orientation.y;\n  \n  float osc = sin(((uv.x+uv.y)*freq)+offset);\n  \n  osc = map(osc, -1.0, 1.0, range.x, range.y);\n  \n  vec3 color = vec3(osc);\n\n  gl_FragColor = vec4(color,1.0);\n}\n\t",
            "updateGroup": {}
          }
        },
        {
          "id": "npreoZXdbjOWHmVbiLaeN",
          "path": "/app/shaders/Generators/UV",
          "name": "UV",
          "size": 721,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "UV",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n    ",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n    gl_Position = positionVec4;\n}\n    ",
            "frag": "varying vec2 vTexCoord; uniform vec2 resolution;\nuniform bool bSquare;\nvoid main() {\n    vec3 color = vec3(0.0);\n    float aspect = resolution.y/resolution.x;\n    vec2 uv = vTexCoord;\n    if(bSquare) {\n        uv.y *= aspect;\t    \n    }\n    gl_FragColor = vec4(uv.x,uv.y,1.0,1.0);\n}\n\t",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "M-yHctKbRzzwb3_IcINk7",
      "path": "/app/shaders/Gradients",
      "name": "Gradients",
      "size": 772,
      "type": "directory",
      "children": [
        {
          "id": "LP0RShPHjshf3aJduR4fc",
          "path": "/app/shaders/Gradients/Circle",
          "name": "Circle",
          "size": 772,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Circle",
            "inputs": ["tex0"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \nuniform sampler2D tex0;\nuniform vec2 focus_pos; //{'default': [0.5,0.5]}\n\nvoid main() {        \n    vec4 uv = texture2D(tex0, vTexCoord);\n    \n    vec4 color = vec4(distance(uv.rg, vec2(focus_pos)));\n    gl_FragColor = vec4(color.rgb, 1.0);    \n}",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "AusWWfHqANkFEQ_CBDXUu",
      "path": "/app/shaders/Image",
      "name": "Image",
      "size": 11253,
      "type": "directory",
      "children": [
        {
          "id": "YBnmTNVuZo5fnAm1AoWaF",
          "path": "/app/shaders/Image/Blur",
          "name": "Blur",
          "size": 2952,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Blur",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n    gl_Position = positionVec4;\n}\n\t",
            "frag": "// adapted from https://webgl-shaders.com/shaders/frag-blur.glsl\nuniform vec2 resolution;\nvarying vec2 vTexCoord;\n\nuniform sampler2D tex0;\nuniform float size;\n\nvoid main() {\n  vec3 color;\n  vec2 uv = vTexCoord;\n\n  // Apply the gaussian kernel\n  float step = 1.0 + 2.0 * size;\n  color += (1.0 / 256.0) * texture2D(tex0, uv + step * vec2(-2, -2) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(-2, -1) / resolution).rgb;\n  color += (6.0 / 256.0) * texture2D(tex0, uv + step * vec2(-2, 0) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(-2, 1) / resolution).rgb;\n  color += (1.0 / 256.0) * texture2D(tex0, uv + step * vec2(-2, 2) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(-1, -2) / resolution).rgb;\n  color += (16.0 / 256.0) * texture2D(tex0, uv + step * vec2(-1, -1) / resolution).rgb;\n  color += (24.0 / 256.0) * texture2D(tex0, uv + step * vec2(-1, 0) / resolution).rgb;\n  color += (16.0 / 256.0) * texture2D(tex0, uv + step * vec2(-1, 1) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(-1, 2) / resolution).rgb;\n  color += (6.0 / 256.0) * texture2D(tex0, uv + step * vec2(0, -2) / resolution).rgb;\n  color += (24.0 / 256.0) * texture2D(tex0, uv + step * vec2(0, -1) / resolution).rgb;\n  color += (36.0 / 256.0) * texture2D(tex0, uv + step * vec2(0, 0) / resolution).rgb;\n  color += (24.0 / 256.0) * texture2D(tex0, uv + step * vec2(0, 1) / resolution).rgb;\n  color += (6.0 / 256.0) * texture2D(tex0, uv + step * vec2(0, 2) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(1, -2) / resolution).rgb;\n  color += (16.0 / 256.0) * texture2D(tex0, uv + step * vec2(1, -1) / resolution).rgb;\n  color += (24.0 / 256.0) * texture2D(tex0, uv + step * vec2(1, 0) / resolution).rgb;\n  color += (16.0 / 256.0) * texture2D(tex0, uv + step * vec2(1, 1) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(1, 2) / resolution).rgb;\n  color += (1.0 / 256.0) * texture2D(tex0, uv + step * vec2(2, -2) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(2, -1) / resolution).rgb;\n  color += (6.0 / 256.0) * texture2D(tex0, uv + step * vec2(2, 0) / resolution).rgb;\n  color += (4.0 / 256.0) * texture2D(tex0, uv + step * vec2(2, 1) / resolution).rgb;\n  color += (1.0 / 256.0) * texture2D(tex0, uv + step * vec2(2, 2) / resolution).rgb;\n\n  // Fragment shader output\n  gl_FragColor = vec4(color, 1.0);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "kIRxK5zie_X0HJytIBYZC",
          "path": "/app/shaders/Image/EdgeDetect",
          "name": "EdgeDetect",
          "size": 2033,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "EdgeDetect",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "#ifdef GL_ES \n   precision highp float; \n#endif \n",
            "vert": "attribute vec3 aPosition; \nattribute vec2 aTexCoord; \nvarying vec2 vTexCoord; \n\nvoid main() {  \n   vTexCoord = aTexCoord; \n   vec4 positionVec4 = vec4(aPosition, 1.0); \n   positionVec4.xy = positionVec4.xy * vec2(1., -1.); \n   gl_Position = positionVec4; \n}",
            "frag": "uniform sampler2D tex0;\nuniform vec2 resolution;\n\n// Texture varyings\nvarying vec2 vTexCoord;\n\nuniform float amount;\n\n/*\n * The main program\n */\nvoid main() {\n    // Calculate the pixel color based on the mouse position\n    vec3 pixel_color;\n  \tvec2 v_uv = vTexCoord;\n\n    // Apply the edge detection kernel\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(-1, -1) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(-1, 0) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(-1, 1) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(0, -1) / resolution).rgb;\n    pixel_color += 8.0 * texture2D(tex0, v_uv + vec2(0, 0) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(0, 1) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(1, -1) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(1, 0) / resolution).rgb;\n    pixel_color += -1.0 * texture2D(tex0, v_uv + vec2(1, 1) / resolution).rgb;\n\n    // Use the most extreme color value\n    float min_value = min(pixel_color.r, min(pixel_color.g, pixel_color.b));\n    float max_value = max(pixel_color.r, max(pixel_color.g, pixel_color.b));\n\n    if (abs(min_value) > abs(max_value)) {\n        pixel_color = vec3(min_value);\n    } else {\n        pixel_color = vec3(max_value);\n    }\n\n    // Rescale the pixel color using the mouse y position\n    float scale = 0.2 + 2.5 * amount;\n    pixel_color = 0.5 + scale * pixel_color;\n\n    // Fragment shader output\n    gl_FragColor = vec4(pixel_color, 1.0);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "fuzA4liO36JYNUisBM7k2",
          "path": "/app/shaders/Image/Invert",
          "name": "Invert",
          "size": 662,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Invert",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n#ifdef GL_ES\nprecision highp float;\n#endif \n",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\nuniform float amount;\n\nvoid main() {\n    vec4 src = texture2D(tex0, vTexCoord);        \n\n    vec3 color = amount - src.rgb;\n\n    gl_FragColor = vec4(color,src.a);\n}\n",
            "updateGroup": {}
          }
        },
        {
          "id": "YWxeuCnzqpP7CefKAbHAz",
          "path": "/app/shaders/Image/Luma",
          "name": "Luma",
          "size": 882,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Luma",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "\n    attribute vec3 aPosition;\n    attribute vec2 aTexCoord;\n    varying vec2 vTexCoord;\n    void main() {\n        vTexCoord = aTexCoord;\n        vec4 positionVec4 = vec4(aPosition,1.0);\n        positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n        gl_Position = positionVec4;\n    }\n\t",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\n\n// https://github.com/hughsk/glsl-luma\nfloat luma(vec3 color) {\n  \treturn dot(color, vec3(0.299, 0.587, 0.114));\n}\n\nfloat luma(vec4 color) {\n  \treturn dot(color.rgb, vec3(0.299, 0.587, 0.114));\n}\n\nvoid main() {\n    vec4 color = texture2D(tex0, vTexCoord);\n      \n\tcolor = vec4(vec3(luma(color)), color.a);\n  \n\tgl_FragColor = color;\n}\n",
            "updateGroup": {}
          }
        },
        {
          "id": "5-RiJvfB64Ov_Ez39cUtQ",
          "path": "/app/shaders/Image/Pixelate",
          "name": "Pixelate",
          "size": 1628,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Pixelate",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "#ifdef GL_ES \n   precision highp float; \n#endif \n",
            "vert": "attribute vec3 aPosition; \nattribute vec2 aTexCoord; \nvarying vec2 vTexCoord; \n\nvoid main() {  \n   vTexCoord = aTexCoord; \n   vec4 positionVec4 = vec4(aPosition, 1.0); \n   positionVec4.xy = positionVec4.xy * vec2(1., -1.); \n   gl_Position = positionVec4; \n}",
            "frag": "// adapted from https://webgl-shaders.com/shaders/frag-pixelated.glsl\n\nvarying vec2 vTexCoord; \nuniform sampler2D tex0; \nuniform vec2 resolution; \nuniform float size;\n\n/*\n * The main program\n */\nvoid main() {\n  \tvec2 v_uv = vTexCoord;\n\t// Calculate the square size in pixel units based on the mouse position\n\tfloat square_size = floor(2.0 + 30.0 * (size));\n\n\t// Calculate the square center and corners\n\tvec2 center = square_size * floor(v_uv * resolution / square_size) + square_size * vec2(0.5, 0.5);\n\tvec2 corner1 = center + square_size * vec2(-0.5, -0.5);\n\tvec2 corner2 = center + square_size * vec2(+0.5, -0.5);\n\tvec2 corner3 = center + square_size * vec2(+0.5, +0.5);\n\tvec2 corner4 = center + square_size * vec2(-0.5, +0.5);\n\n\t// Calculate the average pixel color\n\tvec3 pixel_color = 0.4 * texture2D(tex0, center / resolution).rgb;\n\tpixel_color += 0.15 * texture2D(tex0, corner1 / resolution).rgb;\n\tpixel_color += 0.15 * texture2D(tex0, corner2 / resolution).rgb;\n\tpixel_color += 0.15 * texture2D(tex0, corner3 / resolution).rgb;\n\tpixel_color += 0.15 * texture2D(tex0, corner4 / resolution).rgb;\n\n\t// Fragment shader output\n\tgl_FragColor = vec4(pixel_color, 1.0);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "SOXrj0yoSqurj5mwXwr9n",
          "path": "/app/shaders/Image/Sharpen",
          "name": "Sharpen",
          "size": 1238,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Sharpen",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n#ifdef GL_ES\nprecision highp float;\n#endif \n",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nuniform vec2 resolution;\nuniform float width;\nvarying vec2 texcoord11;\nvarying vec2 texcoord00;\nvarying vec2 texcoord02;\nvarying vec2 texcoord20;\nvarying vec2 texcoord22;\nvoid main() {\n    gl_Position = vec4(((aPosition.xy / resolution) * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);\n    texcoord11 = aTexCoord;\n    texcoord00 = aTexCoord + vec2(-width, -width);\n    texcoord02 = aTexCoord + vec2(width, -width);\n    texcoord20 = aTexCoord + vec2(width, width);\n    texcoord22 = aTexCoord + vec2(-width, width);\n}",
            "frag": "varying vec2 texcoord11;\nvarying vec2 texcoord00;\nvarying vec2 texcoord02;\nvarying vec2 texcoord20;\nvarying vec2 texcoord22;\n\nuniform sampler2D tex0;\n\nvoid main() {\t\n    vec4 s11 = texture2D(tex0, texcoord11);\n    vec4 s00 = texture2D(tex0, texcoord00);\n    vec4 s02 = texture2D(tex0, texcoord02);\n    vec4 s20 = texture2D(tex0, texcoord20);\n    vec4 s22 = texture2D(tex0, texcoord22);\n    \n    vec4 sharp = 5.0 * s11 - (s00 + s02 + s20 + s22);\n    gl_FragColor = sharp;\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "oZu4-k1-JvYgxf-1bPp40",
          "path": "/app/shaders/Image/Threshold",
          "name": "Threshold",
          "size": 1101,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Threshold",
            "inputs": ["tex0"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n#ifdef GL_ES\nprecision highp float;\n#endif \n",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\nuniform float low; //{\"default\": 0.4}\nuniform float high; \nuniform bool b_invert;\n\n// https://github.com/hughsk/glsl-luma/blob/master/index.glsl\nfloat luma(vec3 color) {\nreturn dot(color, vec3(0.299, 0.587, 0.114));\n}\n\nfloat luma(vec4 color) {\nreturn dot(color.rgb, vec3(0.299, 0.587, 0.114));\n}\n\nvoid main() {\n    vec4 src = texture2D(tex0, vTexCoord);        \n    \n    bool thresh = (luma(src) > low) && (luma(src) < high);\n\n    vec3 color = vec3(0.0);\n\n    if(thresh){\n        color = vec3(1.0);\n    }\n\n    gl_FragColor = vec4(color.rgb,src.a);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "P_Y2u7uSGFRp9OrdbH4IR",
          "path": "/app/shaders/Image/ZoomPan",
          "name": "ZoomPan",
          "size": 757,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "ZoomPan",
            "inputs": ["tex0"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n\n    vec4 positionVec4 = vec4(aPosition,1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1.,-1.);\n\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;  \nuniform vec2 resolution; \n\nuniform sampler2D tex0;\nuniform vec2 zoom; //{'zoom':[1,1]}\nuniform vec2 pan; //{'default':[0,0]}\n\nvoid main() {  \n  vec2 uv = vTexCoord;\n  uv *= zoom;\n  uv += pan;\n  vec4 src = texture2D(tex0, uv);\n  gl_FragColor = src;    \n}",
            "updateGroup": {}
          }
        },
        {
          "id": "4kkTh",
          "name": "Contrast",
          "type": "file",
          "data": {
            "type": "Shader",
            "name": "Contrast",
            "inputs": ["tex0"],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "#ifdef GL_ES \n   precision highp float; \n#endif \n",
            "vert": "attribute vec3 aPosition; \nattribute vec2 aTexCoord; \nvarying vec2 vTexCoord; \n\nvoid main() {  \n   vTexCoord = aTexCoord; \n   vec4 positionVec4 = vec4(aPosition, 1.0); \n   positionVec4.xy = positionVec4.xy * vec2(1., -1.); \n   gl_Position = positionVec4; \n}",
            "frag": "varying vec2 vTexCoord; \nuniform sampler2D tex0; \nuniform vec2 resolution; \nuniform float amount;\nuniform float saturation;\n\nvoid main() {\n\tvec3 color = vec3(texture2D(tex0, vTexCoord));\n\tconst vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);\n\t\n\tvec3 AvgLumin = vec3(0.5, 0.5, 0.5);\n\n\tvec3 intensity = vec3(dot(color, LumCoeff));\n\n\t// could substitute a uniform for this 1. and have variable saturation\n\tvec3 satColor = mix(intensity, color, saturation); \n\tvec3 conColor = mix(AvgLumin, satColor, amount);\n\n\tgl_FragColor = vec4(conColor, 1);\n}",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "LafWlFpYCeavK88GZG1EG",
      "path": "/app/shaders/Math",
      "name": "Math",
      "size": 2637,
      "type": "directory",
      "children": [
        {
          "id": "7Gwxn0aukD9xa8LKE7-n6",
          "path": "/app/shaders/Math/Add",
          "name": "Add",
          "size": 660,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Add",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n#ifdef GL_ES\nprecision highp float;\n#endif \n",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}\n",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform sampler2D tex1;\nuniform vec2 resolution;\n\nvoid main() {\n    vec4 src0 = texture2D(tex0,vTexCoord);\n    vec4 src1 = texture2D(tex1,vTexCoord);\n    vec4 color = src0 + src1;\n    gl_FragColor = color;\n}\n",
            "updateGroup": {}
          }
        },
        {
          "id": "__OCyaG8Li9g64dwO-vj1",
          "path": "/app/shaders/Math/Divide",
          "name": "Divide",
          "size": 645,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Divide",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform sampler2D tex1;\n\nvoid main() {\n    vec4 src0 = texture2D(tex0,vTexCoord);\n    vec4 src1 = texture2D(tex1,vTexCoord);\n    vec4 color = src0 / src1;\n    gl_FragColor = color;\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "yw2eKJaa_mgFM5YS-1wL4",
          "path": "/app/shaders/Math/Multiply",
          "name": "Multiply",
          "size": 646,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Multiply",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform sampler2D tex1;\n\nvoid main() {\n    vec4 src0 = texture2D(tex0,vTexCoord);\n    vec4 src1 = texture2D(tex1,vTexCoord);\n    vec4 color = src0 * src1;\n    gl_FragColor = color;\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "-Xr3NAcyymhU-JKP5bneA",
          "path": "/app/shaders/Math/Subtract",
          "name": "Subtract",
          "size": 686,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "Subtract",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform sampler2D tex1;\n\nvoid main() {\n    vec4 src0 = texture2D(tex0,vTexCoord);\n    vec4 src1 = texture2D(tex1,vTexCoord);\n    vec4 color = src0 - src1;\n    color.a = 1.0;\n    gl_FragColor = color;\n}",
            "updateGroup": {}
          }
        }
      ]
    },
    {
      "id": "CquqfCQi8azdZBQIqK0Rn",
      "path": "/app/shaders/Spirit Deck",
      "name": "Spirit Deck",
      "size": 3949,
      "type": "directory",
      "children": [
        {
          "id": "G37YJAGkUMlXYameXZEGD",
          "path": "/app/shaders/Spirit Deck/The_Chariot",
          "name": "The_Chariot",
          "size": 1648,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "The_Chariot",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\n\nvec2 rotate(vec2 st, float a) {\n    st = mat2(cos(a),-sin(a),sin(a),cos(a))*(st-0.5);\n    return st+0.5;\n}\n\nfloat flip(float v, float pct) {\n    return mix(v, 1.0 - v, pct);\n}\n\nfloat stroke(float x, float s, float w) {\n    float d = step(s,x+w*0.5) - step(s,x-w*0.5);\n    return clamp(d, 0.0, 1.0);\n}\n\nfloat fill(float x, float size) {\n    return 1.0-step(size, x);\n}\n\nfloat rectSDF(vec2 st, vec2 s) {\n    st = st*2.0-1.0;\n    return max(abs(st.x/s.x),abs(st.y/s.y));\n}\n\nvec3 bridge(vec3 c,float d,float s,float w) {\n    c *= 1.0-stroke(d,s,w*2.0);\n    return c + stroke(d,s,w);\n}\n\nvoid main() {\n    vec3 color = vec3(0.0);\n    //vec2 st = vTexCoord;\n    vec2 st = texture2D(tex0,vTexCoord).rg;\n\n    float r1 = rectSDF(st, vec2(1.0));\n    float r2 = rectSDF(rotate(st,radians(45.0)),vec2(1.0));\n    \n    float inv = step(0.5,(st.x+st.y)*0.5);\n    inv = flip(inv,step(0.5,0.5+(st.x-st.y)*0.5));\n    \n    float w = 0.075;\n    color += stroke(r1,0.5,w) + stroke(r2,0.5,w);\n    \n    float bridges = mix(r1,r2,inv);\n    color = bridge(color, bridges, 0.5, w);\n\n    gl_FragColor = vec4(color.rgb, 1.0);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "705giPcKXgGxujXR8fAo9",
          "path": "/app/shaders/Spirit Deck/The_Empress",
          "name": "The_Empress",
          "size": 1151,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "The_Empress",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform vec2 resolution;\n\nconst float PI = 3.1415926538;\nconst float TAU = 6.28318530718;\n\nfloat polySDF(vec2 st, int V) {\n    st = st * 2.0 - 1.0;\n    float a = atan(st.x,st.y)+PI;\n    float r = length(st);\n    float v = TAU / float(V);\n    return cos(floor(0.5+a/v)*v-a)*r;\n}\n\nfloat fill(float x, float size) {\n    return 1.-step(size, x);\n}\n\nvoid main() {\n    vec4 color = vec4(0.0);\n    vec2 st = vTexCoord;\n    \n    float d1 = polySDF(st,5);\n    vec2 ts = vec2(st.x,1.0-st.y);\n    float d2 = polySDF(ts,5);\n    \n    color += fill(d1,0.75) * fill(fract(d1*5.0),0.5);\n    color -= fill(d1,0.6) * fill(fract(d2*4.9),0.45);\n    \n    gl_FragColor = vec4(color.rgb,1.0);\n}",
            "updateGroup": {}
          }
        },
        {
          "id": "TTJrPC25pIjjjcrkFFdaE",
          "path": "/app/shaders/Spirit Deck/The_Tower",
          "name": "The_Tower",
          "size": 1150,
          "type": "file",
          "extension": "",
          "data": {
            "type": "Shader",
            "name": "The_Tower",
            "inputs": [],
            "outputs": ["out"],
            "uniforms": [],
            "precision": "\n\t\t#ifdef GL_ES\n\t\tprecision highp float;\n\t\t#endif \n\t",
            "vert": "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n    vTexCoord = aTexCoord;\n    vec4 positionVec4 = vec4(aPosition, 1.0);\n    positionVec4.xy = positionVec4.xy * vec2(1., -1.);\n    gl_Position = positionVec4;\n}",
            "frag": "varying vec2 vTexCoord;\nuniform sampler2D tex0;\nuniform vec2 resolution;\n\nfloat flip(float v, float pct) {\n    return mix(v, 1.0 - v, pct);\n}\n\nfloat stroke(float x, float s, float w) {\n    float d = step(s,x+w*0.5) - step(s,x-w*0.5);\n    return clamp(d, 0.0, 1.0);\n}\n\nfloat fill(float x, float size) {\n    return 1.0-step(size, x);\n}\n\nfloat rectSDF(vec2 st, vec2 s) {\n    st = st*2.0-1.0;\n    return max(abs(st.x/s.x),abs(st.y/s.y));\n}\n\nvoid main() {\n    vec4 color = vec4(0.0);\n    vec2 st = vTexCoord;\n    float rect = rectSDF(st, vec2(0.5,1.0));\n    float diag = (st.x+st.y)*0.5;\n    color  +=  flip(fill(rect,0.6),stroke(diag,0.5,0.01));\n    \n    gl_FragColor = vec4(vec3(color.rgb), 1.0);\n}",
            "updateGroup": {}
          }
        }
      ]
    }
  ]
}
