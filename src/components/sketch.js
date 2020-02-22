import Glyph from './Glyph';

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
        },
        padding: [10,10]
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
                    seed: props.levels[i].seed,
                    padding: [props.levels[i].padX, props.levels[i].padY] 
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
            new Glyph(p)
            .anchor(0, 0)
            .dim(layers[0].dim[0], layers[0].dim[1])
            .size(p.width, p.height)
            .seed(layers[0].seed)
            .noise(layers[0].noise.scale, layers[0].noise.steps)
            // .stroke(0)
            .fill(layers[0].seed * 255)
            .padding(layers[0].padding[0], layers[0].padding[1])
            // .draw()
        );

        console.log(layers[0].padding)

        glyphs[0].next((t, x, y, i)  => next_func(t, x, y, i, 1));
    }

    let next_func = (t, x, y, i, l) => {
        let w = t.width / t.x_dim;
        let h = t.height / t.y_dim;

        let glyph = new Glyph(p)
            .anchor(t.x_anchor + x * w + t.x_padding, t.y_anchor + y * h + t.y_padding)
            .dim(layers[l].dim[0], layers[l].dim[1])
            .size(w - t.x_padding, h - t.y_padding)
            .seed(layers[l].seed + t.cells[i])
            .noise(layers[l].noise.scale, layers[1].noise.steps)
            // .stroke(255)
            .fill(t.cells[i]*255)
            .fill(0)
            // .fill(0)
            // .padding(1,1)
            .draw()

        // (previous glyph, x coord, y coord, cell index)
        glyphs.push(glyph);

        if(l < layers.length - 1){
            l += 1;
            glyph.next((t, x, y, i) => next_func(t, x, y, i, l))
        } 
    }
}



