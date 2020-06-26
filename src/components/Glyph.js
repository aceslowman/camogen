export default class Glyph {
    constructor(p) {
        this.cells = [];
        this.p = p;

        this._seed = Math.random()*1000;

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
        this.p.noiseSeed(this._seed);

        for (let _x = 0; _x < this.x_dim; _x++) {
            for (let _y = 0; _y < this.y_dim; _y++) {
                let cell = this.p.noise((_x * scale) + this._seed, (_y * scale) + this._seed);

                if (steps !== undefined) {
                    cell = Math.floor(cell * (steps + 1)) / (steps - 1);
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
            for (let _y = 0; _y < this.y_dim; _y++ , i++) {
                f(this, _x, _y, i); //move to draw
            }
        }
    }

    draw() {
        for (let _x = 0, i = 0; _x < this.x_dim; _x++) {
            for (let _y = 0; _y < this.y_dim; _y++ , i++) {
                let pos_x = _x / this.x_dim * this.width;
                pos_x += this.x_anchor;

                let pos_y = _y / this.y_dim * this.height;
                pos_y += this.y_anchor;

                this.stroke_color !== undefined ? this.p.stroke(this.stroke_color) : this.p.noStroke();
                this.fill_color !== undefined ? this.p.fill(this.fill_color, this.cells[i] > 0.5 ? 255 : 0) : this.p.noFill();

                this.p.rect(Math.floor(pos_x), Math.floor(pos_y), Math.ceil(this.width / this.x_dim), Math.ceil(this.height / this.y_dim));

                // debug numbers
                // fill(128)
                // text(this.cells[i].toFixed(2),pos_x+(this.height / this.x_dim)/2,pos_y+(this.height / this.y_dim)/2);
            }
        }

        return this;
    }
}