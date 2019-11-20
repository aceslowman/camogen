import React from 'react';
import p5 from 'p5';

let glyphs = [];
let layers;

let sketch = (p) => {
    p.setup = () => {
        console.log('setup');

        let canvas = p.createCanvas(window.innerHeight, window.innerHeight);
        canvas.parent('canvascontainer');

        p.smooth();
        p.colorMode(p.HSB, 255);
        p.background(255);

        layers = [{
                glyphs: [],
                dim: [30, 30],
                noise: {
                    scale: 0.1,
                    steps: 8
                }
            },
            {
                glyphs: [],
                dim: [3, 3],
                noise: {
                    scale: 0.1,
                    steps: 6
                }
            },
        ];

        generate(p);
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
//             size: [p5.width, p5.height],
//             dim: [p5.random(1, 60), p5.random(1, 60)],
//             noise: {
//                 scale: p5.random(2),
//                 steps: p5.random(10)
//             }
//         },
//         {
//             glyphs: [],
//             size: [p5.width, p5.height],
//             dim: [p5.random(1, 60), p5.random(1, 60)],
//             noise: {
//                 scale: p5.random(2),
//                 steps: p5.random(10)
//             }
//         },
//     ];

//     generate();
//     // createUI();
// }

let generate = (p) => {
    p.background(255);
    let containerSeed = p5.floor(p5.random(5000));

    glyphs = [];

    console.log(layers);

    glyphs.push(
        new Glyph()
        .anchor(0, 0)
        .dim(layers[0].dim[0], layers[0].dim[1])
        .size(p5.width, p5.height)
        .seed(containerSeed)
        .noise(layers[0].noise.scale, layers[0].noise.steps)
        // .stroke(0)
        .fill(containerSeed * 255)
        // .padding(10,10)
        .draw()
    );

    glyphs[0].next((t, x, y, i) => {
        let w = t.width / t.x_dim;
        let h = t.height / t.y_dim;

        let glyph = new Glyph()
            .anchor(x * w + t.x_padding, y * h + t.y_padding)
            .dim(layers[1].dim[0], layers[1].dim[1])
            .size(w - t.x_padding, h - t.y_padding)
            .seed(t._seed + t.cells[i])
            .noise(layers[1].noise.scale, layers[1].noise.steps)
            // .stroke(255)
            // .fill(t.cells[i]*255)
            .fill(0)
            // .fill(0)
            // .padding(1,1)
            .draw()

        // (previous glyph, x coord, y coord, cell index)
        glyphs.push(glyph);
    });
}

class Glyph {
    constructor() {
        this.cells = [];

        this._seed = p5.random(1000);

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
        p5.noiseSeed(this._seed);

        for (let _x = 0; _x < this.x_dim; _x++) {
            for (let _y = 0; _y < this.y_dim; _y++) {
                let cell = p5.noise((_x * scale) + this._seed, (_y * scale) + this._seed);

                if (steps != undefined) {
                    cell = p5.floor(cell * (steps + 1)) / (steps - 1);
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

                this.stroke_color != undefined ? p5.stroke(this.stroke_color) : p5.noStroke();
                this.fill_color != undefined ? p5.fill(this.fill_color, this.cells[i] > 0.5 ? 255 : 0) : p5.noFill();

                p5.rect(p5.floor(pos_x), p5.floor(pos_y), p5.ceil(this.width / this.x_dim), p5.ceil(this.height / this.y_dim));

                // debug numbers
                // fill(128)
                // text(this.cells[i].toFixed(2),pos_x+(this.height / this.x_dim)/2,pos_y+(this.height / this.y_dim)/2);
            }
        }

        return this;
    }
}

export default class SketchContainer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.pInstance = new p5(sketch);

    }

    render() {
        return ( 
        <div id="canvascontainer"ref={this.ref}>

        </div>
        )
    }
}