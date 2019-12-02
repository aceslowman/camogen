import DebugShader from './shaders/DebugShader'; 
import GlyphGenerator from './shaders/GlyphGenerator'; 

let glyphs = [];
let generateFlag = false;
let snapshotFlag = false;

let canvas;
let canvas_width = window.innerHeight;
let canvas_height = window.innerHeight;

// default shaders
let glyphShader, debugShader;

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
let passes = [];
let img;

export default function sketch(p) {

    p.setup = () => {
        canvas = p.createCanvas(canvas_width,canvas_height);

        img = p.createImage(1,1);

        p.smooth();
        p.colorMode(p.HSB, 255);
        p.background(128);

        for(let i = 0; i < 2; i++) {
            let pg = p.createGraphics(p.width,p.height,p.WEBGL);

            // this should be moved over to custom class
            let s = pg.createShader(DebugShader.vert, DebugShader.frag);
            let t;

            if(i === 0) {
                t = img;
            }else {
                t = passes[i-1];
            }
            
            s.setUniform('tex0', t);
            s.setUniform('resolution', [pg.width, pg.height]);
            s.setUniform('dimensions', [6,6]);
            s.setUniform('level',i);
            s.setUniform('seed', Math.random() * 1000);
            
            pg.noStroke();

            shaders.push(s);
            passes.push(pg);
        }
    }

    p.draw = () =>  {
        for(let i = 0; i < shaders.length; i++) {
            let s = shaders[i];
            let pg = passes[i];
            let t;

            if (i === 0) {
                t = img;
            } else {
                t = passes[i-1];
            }

            s.setUniform('tex0', t);
            s.setUniform('resolution', [pg.width, pg.height]);
            s.setUniform('dimensions', [6,6]);
            s.setUniform('level',i);

            pg.shader(s);

            pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);

            // pg.noLoop();
        }

        p.image(passes[passes.length-1],0,0,p.width,p.height);
        // p.noLoop();
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
            
            for(let i = 0; i < passes.length; i++) {
                passes[i].resizeCanvas(canvas_width,canvas_height);
            }
            
            if(glyphShader !== undefined) 
                glyphShader.setUniform('resolution',[canvas_width,canvas_height]);
        }

        if (props.height !== canvas_height) {
            canvas_height = props.height;
            p.resizeCanvas(canvas_width, canvas_height);
            
            for(let i = 0; i < passes.length; i++) {
                passes[i].resizeCanvas(canvas_width, canvas_height);
            }
            
            if(glyphShader !== undefined) 
                glyphShader.setUniform('resolution',[canvas_width,canvas_height]);
        }

        if(props.generateFlag !== generateFlag) {
            // generate();
            generateFlag = props.generateFlag;
        }

        if(props.snapshotFlag !== snapshotFlag) {
            p.saveCanvas(canvas,'camogen_'+stringGen(6));
            snapshotFlag = props.snapshotFlag;
        }
    };
}