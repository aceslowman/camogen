let glyphs = [];
let generateFlag = false;
let snapshotFlag = false;

let canvas;
let canvas_width = window.innerHeight;
let canvas_height = window.innerHeight;

let glyph_shader;

let precision = `
#ifdef GL_ES
precision highp float;
#endif 
`;

let simplex = `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
            i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
        dot(p2, x2), dot(p3, x3)));
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0
        0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) +
        i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    // Compute final noise value at P
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
`;

let vs = precision + `
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

let fs = precision + simplex + `
varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 resolution;
uniform vec2 dimensions;
uniform int level; 
uniform float seed;

void main() {
    vec2 uv = vTexCoord;

    float aspect = resolution.x/resolution.y;
    uv.x *= aspect;

    float s_x = floor(uv.x * dimensions.x) / dimensions.x;
    float s_y = floor(uv.y * dimensions.y) / dimensions.y;
    vec2 grid = vec2(s_x,s_y);

    float n = snoise(vec3(grid,seed));

    vec4 color = vec4(n,n,level,1.0);
    // vec4 color = vec4(float(level) / 3., 0.0, , 1.0);

    vec4 src = texture2D(tex0,uv);

    color += src*2.;

    gl_FragColor = color;
}
`;

// https: //stackoverflow.com/questions/16106701/how-to-generate-a-random-string-of-letters-and-numbers-in-javascript
function stringGen(len) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

let layers = [{
        glyphs: [],
        dim: [30, 30],
        seed: Math.random() * 1000,
        noise: {
            scale: 0.1,
            steps: 8
        }
    },
    {
        glyphs: [],
        dim: [3, 3],
        seed: Math.random() * 1000,
        noise: {
            scale: 0.1,
            steps: 6
        }
    },
];

let shaders = [];
let buffers = [];

// adapted from multipass example at
// https://www.openprocessing.org/sketch/496452/

let fbo;
let tex =  {
    src: null,
    dst: null,
    swap: () =>  {
        let tmp = this.src;
        this.src = this.dst;
        this.dst = tmp;
    }
}
const SCREEN_SCALE = 1.0;

export default function sketch(p) {

    p.setup = () => {
        canvas = p.createCanvas(canvas_width,canvas_height,p.WEBGL);

        p.smooth();
        p.colorMode(p.HSB, 255);
        p.background(255);

        for(let i = 0; i < 2; i++) {
            let pg = p.createGraphics(canvas_width,canvas_height,p.WEBGL);
            let s = pg.createShader(vs, fs);
            let t;

            if(i === 0) {
                t = new p.createImage(1,1);
            }else {
                t = buffers[i-1];
            }
            
            // s.setUniform('tex0', t);
            s.setUniform('resolution', [p.width, p.height]);
            s.setUniform('dimensions', [4, 4]);
            s.setUniform('seed', Math.random() * 1000);

            pg.shader(s);

            shaders.push(s);
            buffers.push(pg);
        }

        let gl = canvas.GL;
        // canvas.drawingContext is also a target

        // create frame buffer
        fbo = gl.createFramebuffer();

        let def =  {
            target: gl.TEXTURE_2D, 
            iformat: gl.RGBA32F, 
            format: gl.RGBA, 
            type: gl.FLOAT, 
            wrap: gl.CLAMP_TO_EDGE, 
            filter: [gl.NEAREST, gl.LINEAR]
        }

        let tex_w = Math.ceil(p.width * SCREEN_SCALE);
        let tex_h = Math.ceil(p.height * SCREEN_SCALE);

        tex.src = gl.texImage2D(def.target, 0, def.iformat, tex_w, tex_h, 0, def.format, def.type, new Float32Array(tex_w * tex_h));
        tex.dst = gl.texImage2D(def.target, 0, def.iformat, tex_w, tex_h, 0, def.format, def.type, new Float32Array(tex_w * tex_h));

        console.log(shaders[0]);
    }

    p.draw = () =>  {
        // for(let i = 0; i < shaders.length; i++) {
        //     let s = shaders[i];
        //     let pg = buffers[i];
        //     let t;

        //     if (i === 0) {
        //         t = new p.createImage(p.width,p.height);
        //     } else {
        //         // let t_b = buffers[i];
        //         // buffers[i] = buffers[i-1];
        //         // buffers[i-1] = t_b;

        //         t = buffers[i-1];
        //     }

        //     // s.setUniform('tex0', t);
        //     s.setUniform('resolution', [p.width, p.height]);
        //     s.setUniform('dimensions', [4, 4]);
        //     s.setUniform('level',i);
        //     s.setUniform('seed',Math.random()*100);

        //     pg.shader(s);

        //     pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        // }

        console.log('first shader',shaders[0]);
        console.log('first buffer',buffers[0]);

        shaders[0].setUniform('tex0', buffers[0]);
        shaders[0].setUniform('resolution', [p.width, p.height]);
        shaders[0].setUniform('dimensions', [4, 4]);
        shaders[0].setUniform('level',0);
        shaders[0].setUniform('seed',Math.random()*100);

        buffers[0].shader(shaders[0]);

        // map to quad
        buffers[0].quad(-1, -1, 1, -1, 1, 1, -1, 1);

        // target ping pong
        let t_b = buffers[1];
        buffers[1] = buffers[0];
        buffers[0] = t_b;

        shaders[1].setUniform('tex0',buffers[1]);
        shaders[1].setUniform('resolution', [p.width, p.height]);
        shaders[1].setUniform('dimensions', [8,8]);
        shaders[1].setUniform('level', 1);
        shaders[1].setUniform('seed', Math.random() * 100);

        buffers[1].shader(shaders[1]);

        // console.log(buffers);
        p.texture(buffers[0]);
        p.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        
        // p.background(128);
        // p.image(buffers[0]._renderer.textures[0],0,0,100,100);
        // p.image(buffers[1]._renderer.textures[0],0,100,100,100);
        p.noLoop();
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.levels && layers) {
            if(Object.keys(props.levels).length < layers.length) {
                layers.pop();
            }

            // update local copy of all layers
            for(let i = 0; i < Object.keys(props.levels).length; i++) {
                let t_obj = {
                    noise: {
                        scale: props.levels[i].noiseScale,
                        steps: props.levels[i].noiseSteps
                    },
                    dim: [props.levels[i].dimX,props.levels[i].dimY],
                    seed: props.levels[i].seed
                };

                if(layers[i]) {
                    layers[i] = t_obj;
                }else {
                    layers.push(t_obj);
                }
            }
        }

        if(props.width !== canvas_width) {
            canvas_width = props.width;
            p.resizeCanvas(canvas_width,canvas_height);
            if(glyph_shader !== undefined) 
                glyph_shader.setUniform('resolution',[canvas_width,canvas_height]);
        }

        if (props.height !== canvas_height) {
            canvas_height = props.height;
            p.resizeCanvas(canvas_width, canvas_height);
            if(glyph_shader !== undefined) 
                glyph_shader.setUniform('resolution',[canvas_width,canvas_height]);
        }

        if(props.generateFlag !== generateFlag) {
            generate();
            generateFlag = props.generateFlag;
        }

        if(props.snapshotFlag !== snapshotFlag) {
            p.saveCanvas(canvas,'camogen_'+stringGen(6));
            snapshotFlag = props.snapshotFlag;
        }
    };

    let generate = () => {
        p.background(255);

        glyphs = [];

        glyphs.push(
            new Glyph()
            .anchor(0, 0)
            .dim(layers[0].dim[0], layers[0].dim[1])
            .size(p.width, p.height)
            .seed(layers[0].seed)
            .noise(layers[0].noise.scale, layers[0].noise.steps)
            // .stroke(0)
            .fill(layers[0].seed * 255)
            // .padding(10,10)
            // .draw()
        );

        glyphs[0].next((t, x, y, i)  => next_func(t, x, y, i, 1));
    }

    let next_func = (t, x, y, i, l) => {
        let w = t.width / t.x_dim;
        let h = t.height / t.y_dim;

        // console.log(layers[l]);

        let glyph = new Glyph()
            .anchor(t.x_anchor + x * w + t.x_padding, t.y_anchor + y * h + t.y_padding)
            .dim(layers[l].dim[0], layers[l].dim[1])
            .size(w - t.x_padding, h - t.y_padding)
            .seed(layers[l].seed + t.cells[i])
            .noise(layers[l].noise.scale, layers[1].noise.steps)
            // .stroke(255)
            // .fill(t.cells[i]*255)
            .fill(0)
            // .fill(0)
            // .padding(1,1)
            .draw()

        // (previous glyph, x coord, y coord, cell index)
        glyphs.push(glyph);

        // console.log('l',l);
        // console.log('layers.length',layers.length);

        if(l < layers.length - 1){
            l += 1;
            glyph.next((t, x, y, i) => next_func(t, x, y, i, l))
        } 
    }

    class Glyph {
        constructor() {
            this.cells = [];

            this._seed = p.random(1000);

            this.width = 100;
            this.height = 100;

            this.x_dim = 4;
            this.y_dim = 4;

            this.x_anchor = 0;
            this.y_anchor = 0;

            this.x_padding = 0;
            this.y_padding = 0;

            this.x_margin = 5;
            this.y_margin = 5;
        }

        anchor(x, y) {
            this.x_anchor = x;
            this.y_anchor = y;
            return this;
        }

        padding(x, y) {
            this.x_padding = x;
            this.y_padding = y;
            return this;
        }

        dim(x, y) {
            this.x_dim = x;
            this.y_dim = y;
            return this;
        }

        size(x, y) {
            this.width = x;
            this.height = y;
            return this;
        }

        seed(s) {
            this._seed = s;
            return this;
        }

        noise(scale, steps) {
            p.noiseSeed(this._seed);

            for (let _x = 0; _x < this.x_dim; _x++) {
                for (let _y = 0; _y < this.y_dim; _y++) {
                    let cell = p.noise((_x * scale) + this._seed, (_y * scale) + this._seed);

                    if (steps !== undefined) {
                        cell = p.floor(cell * (steps + 1)) / (steps - 1);
                    }

                    this.cells.push(cell);
                }
            }

            return this;
        }

        stroke(c) {
            this.stroke_color = c;
            return this;
        }

        fill(c) {
            this.fill_color = c;
            return this;
        }

        next(f) {
            for (let _x = 0, i = 0; _x < this.x_dim; _x++) {
                for (let _y = 0; _y < this.y_dim; _y++, i++) {
                    f(this, _x, _y, i); //move to draw
                }
            }
        }

        draw() {
            for (let _x = 0, i = 0; _x < this.x_dim; _x++) {
                for (let _y = 0; _y < this.y_dim; _y++, i++) {
                    let pos_x = _x / this.x_dim * this.width;
                    pos_x += this.x_anchor;

                    let pos_y = _y / this.y_dim * this.height;
                    pos_y += this.y_anchor;

                    this.stroke_color !== undefined ? p.stroke(this.stroke_color) : p.noStroke();
                    this.fill_color !== undefined ? p.fill(this.fill_color, this.cells[i] > 0.5 ? 255 : 0) : p.noFill();

                    p.rect(p.floor(pos_x), p.floor(pos_y), p.ceil(this.width / this.x_dim), p.ceil(this.height / this.y_dim));

                    // debug numbers
                    // fill(128)
                    // text(this.cells[i].toFixed(2),pos_x+(this.height / this.x_dim)/2,pos_y+(this.height / this.y_dim)/2);
                }
            }

            return this;
        }
    }
}


