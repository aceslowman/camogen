let glyphs = [];
let layers;
let generateFlag = false;
let snapshotFlag = false;

let canvas;
let canvas_width = window.innerHeight;
let canvas_height = window.innerHeight;

layers = [{
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

// https: //stackoverflow.com/questions/16106701/how-to-generate-a-random-string-of-letters-and-numbers-in-javascript
function stringGen(len) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

export default function sketch(p) {
    p.setup = () => {
        console.log('setup');

        // canvas = p.createCanvas(window.innerHeight, window.innerHeight);
        canvas = p.createCanvas(canvas_width,canvas_height);

        p.smooth();
        p.colorMode(p.HSB, 255);
        p.background(255);

        generate(p);
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
            p.setup();
        }

        if (props.height !== canvas_height) {
            canvas_height = props.height;
            p.setup();
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


// function lvlUp() {
//     layers.push({
//         glyphs: [],
//         dim: [3, 3],
//         noise: {
//             scale: 0.1,
//             steps: 6
//         }
//     });
// }

// function lvlDown() {
//     layers.pop();
// }

// function randomize() {
//     layers = [{
//             glyphs: [],
//             size: [p.width, p.height],
//             dim: [p.random(1, 60), p.random(1, 60)],
//             noise: {
//                 scale: p.random(2),
//                 steps: p.random(10)
//             }
//         },
//         {
//             glyphs: [],
//             size: [p.width, p.height],
//             dim: [p.random(1, 60), p.random(1, 60)],
//             noise: {
//                 scale: p.random(2),
//                 steps: p.random(10)
//             }
//         },
//     ];

//     generate();
//     // createUI();
// }



