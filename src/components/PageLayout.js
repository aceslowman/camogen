import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import NodeContainer from './ui/NodeContainer';
import Draggable from 'react-draggable';
import jspdf from 'jspdf';

const parameter_style = {
    wrapper: {
        width: '50%',
        display: 'inline-block',
        backgroundColor: 'white',
    },
    fieldset: {
        padding: '2px',
        marginTop: '10px',
        display: 'inline-block',
    },
    input: {
        boxSizing: 'border-box',
        width: '75px',
    },
    legend: {
        padding: '2px 4px',
    }
}; 

let page_style = {
    two_pages: {
        display: 'flex',
        flexFlow: 'row',
        border: '1px dashed black',
        backgroundColor: 'white',
    },
    page: {
        display: 'flex',
        flexFlow: 'row',
        border: '1px dashed black',
    },
    left_page: {
        justifyContent: 'flex-end',
    },
    right_page: {
        justifyContent: 'flex-start',
    },
    content_area: {
        border: '1px dashed black',
        backgroundColor: '#eee',
    },
};

const style = {
    wrapper: {
        padding: '0px',
        border: '1px dashed white',
        backgroundColor: 'black',
    },
    legend: {
        color: 'white',
        backgroundColor: 'black',
        border: '1px solid white',
        marginLeft: '7px'
    },
    inner: {
        display: 'flex',
        flexFlow: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    parameter_area: {
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        margin: '15px 30px',
        // width: '75px',
    },
    button: {
        marginTop: '15px',
    }
};

function cloneCanvas(oldCanvas, w, h) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = w;
    newCanvas.height = h;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function lerp(v0, v1, t) {
    return v0 * (1-t) + v1 * t;
}

const PageLayout = observer(class PageLayout extends React.Component {

    static contextType = MainContext;

    constructor(){
        super();
        this.wrapper_ref = React.createRef();
        this.parameters = [];        

        this.state = {
            width: 100,
            height: 100,
            currentPage: 0,
        }
    }         

    componentDidMount(){
        this.pdf = new jspdf({
            orientation: this.page.isPortrait.value ? 'p' : 'l',
            unit: 'px',
            format: 'legal',
        });

        this.generateParameters();
        this.updateStyle();
    }
    
    generateParameters(){
        this.parameters = [];
        
        for(let _p in this.page){
            let p = this.page[_p]
            this.parameters.push(
                <Parameter
                    key={p.name}
                    name={p.name}
                    data={p}
                />
            );
        }
    }

    generatePDF = () => {
        // generate front side
        for(let i = 0; i <= this.page.count.value/2; i++){ 
            this.pdf.addPage('legal', this.page.isPortrait.value ? 'p' : 'l');       
        }

        for (let i = 0; i <= this.page.count.value; i++) {
            this.makePage(i);
        }

        // generate back side
        // NOTE: page numbers are reversed on backside
        // for (let i = 1; i <= this.page.count.value; i += 2) {

        //     if (this.page.isSingle.value) {
        //         this.pdf.addImage(    // SINGLE 
        //             crop_canvas,      // imageData
        //             'PNG',         // format
        //             mT,            // x
        //             mL,            // y
        //             w - (mL + mR), // width
        //             h - (mT + mB), // height
        //             null,          // alias
        //             'NONE',        // compression
        //             0              // rotation
        //         );
        //     } else {
        //         let page_number_l = this.page.count.value - i;
        //         let t = page_number_l / this.page.count.value;

        //         let _x = mL;
        //         let _y = mT;
        //         let _width = (w / 2) - (mL + mR);
        //         let _height = h - (mT + mB);

        //         this.pdf.addImage(          // LEFT HAND
        //             crop_canvas,            // imageData
        //             'PNG',               // format
        //             lerp(_x, 0, t),                  // x
        //             lerp(_y, 0, t),                  // y
        //             lerp(_width, w / 2, t),              // width
        //             lerp(_height, h, t),             // height
        //             null,                // alias
        //             'NONE',              // compression
        //             0                    // rotation
        //         );

        //         this.pdf.text(String(page_number_l), 7, h - 7.5);

        //         // RIGHT HAND
        //         let page_number_r = i + 1;
        //         t = page_number_r / this.page.count.value;

        //         _x = (w / 2) + mR;
        //         _y = mT;
        //         _width = (w / 2) - (mL + mR);
        //         _height = h - (mT + mB);

        //         this.pdf.addImage(          // RIGHT HAND
        //             crop_canvas,            // imageData
        //             'PNG',               // format
        //             lerp(_x, w / 2, t),                  // x
        //             lerp(_y, 0, t),                  // y
        //             lerp(_width, w / 2, t),              // width
        //             lerp(_height, h, t),        // height
        //             null,                // alias
        //             'NONE',              // compression
        //             0                    // rotation
        //         );


        //         this.pdf.text(String(page_number_r), w - 20, h - 7.5);
        //     }

        //     this.pdf.addPage('legal', this.page.isPortrait.value ? 'p' : 'l');
        // }        
    }

    makePage = (page_number) => {
        let legal = [459, 756];

        this.img = this.context.p5_instance.canvas;
        let mT = this.page.marginTop.value;
        let mB = this.page.marginBottom.value;
        let mL = this.page.marginLeft.value;
        let mR = this.page.marginRight.value;

        let w = this.page.isPortrait.value ? legal[0] : legal[1];
        let h = this.page.isPortrait.value ? legal[1] : legal[0];

        let scalar = 1;

        let crop_canvas = cloneCanvas(
            this.img,
            ((w / 2) - (mL + mR)) * scalar,
            (h - (mT + mB)) * scalar
        );

        let _target = this.store.targets[0];
        let _glyph = _target.shaders[1];
        let _dimensions = _glyph.uniforms[2].value;

        if (this.page.isSingle.value) {
            this.pdf.addImage(    // SINGLE 
                crop_canvas,      // imageData
                'PNG',         // format
                mT,            // x
                mL,            // y
                w - (mL + mR), // width
                h - (mT + mB), // height
                null,          // alias
                'NONE',        // compression
                0              // rotation
            );
        } else {
            let t = page_number / this.page.count.value;

            let _x = mL;
            let _y = mT;
            let _width = (w / 2) - (mL + mR);
            let _height = h - (mT + mB);

            if(t <= 0.5){
                this.pdf.setPage(page_number);
            }else{
                this.pdf.setPage(this.page.count.value - page_number + 1);
            }

            if(page_number == 0){
                // this.pdf.text('title', 7, h - 7.5);
            }else if(page_number % 2 == 0){
                // RIGHT HAND
                _x = (w / 2) + mR;
                _y = mT;
                _width = (w / 2) - (mL + mR);
                _height = h - (mT + mB);

                this.pdf.addImage(          // RIGHT HAND
                    crop_canvas,            // imageData
                    'PNG',                  // format
                    lerp(_x, w / 2, t),     // x
                    lerp(_y, 0, t),         // y
                    lerp(_width, w / 2, t), // width
                    lerp(_height, h, t),    // height
                    null,                   // alias
                    'NONE',                 // compression
                    0                       // rotation
                );

                this.pdf.text(String(page_number), w - 20, h - 7.5);
            }else{
                // LEFT HAND
                this.pdf.addImage(
                    crop_canvas,            // imageData
                    'PNG',                  // format
                    lerp(_x, 0, t),         // x
                    lerp(_y, 0, t),         // y
                    lerp(_width, w / 2, t), // width
                    lerp(_height, h, t),    // height
                    null,                   // alias
                    'NONE',                 // compression
                    0                       // rotation
                );

                this.pdf.text(String(page_number), 7, h - 7.5);
            }   
        }

        console.log('generating');
    }

    savePDF = () => {
        this.pdf.save('test.pdf');
        console.log('pdf saved');
    }

    updateStyle(){
        if(!this.wrapper_ref.current) return;

        if(this.page.isPortrait.value){
            this.aspect = this.page.width.value / this.page.height.value;
        }else{
            this.aspect = this.page.height.value / this.page.width.value;
        }
          
        this.setState({
            // height: this.wrapper_ref.current.offsetHeight,
            // width: this.wrapper_ref.current.offsetHeight * this.aspect,
            height: 400,
            width: 400 * this.aspect,
        });
    }

    render() {
        const { data } = this.props;

        this.store = this.context.store;
        this.page = this.store.page;  

        page_style = {
            ...page_style,
            two_pages: {
                display: 'inline-flex',
                flexFlow: 'row',
                border: '1px dashed black',
                backgroundColor: 'white',
                margin: '15px',
                height: this.state.height + 'px',
            },
            page: {
                display: 'inline-flex',
                flexFlow: 'row',
                border: '1px dashed black', 
                height: this.state.height + 'px',
                width: this.state.width/2 + 'px',               
            },
            left_page: {
                justifyContent: 'flex-end',
            },
            right_page: {
                justifyContent: 'flex-start',
            },
            content_area_left: {
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                border: '1px dashed black',
                backgroundColor: '#eee',
                marginTop: this.store.page.marginTop.value + 'px',
                marginBottom: this.store.page.marginBottom.value + 'px',
                marginLeft: this.store.page.marginLeft.value + 'px',
                marginRight: this.store.page.marginRight.value + 'px',                
            },
            content_area_right: {
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                border: '1px dashed black',
                backgroundColor: '#eee',
                marginTop: this.store.page.marginTop.value + 'px',
                marginBottom: this.store.page.marginBottom.value + 'px',
                marginLeft: this.store.page.marginRight.value + 'px',
                marginRight: this.store.page.marginLeft.value + 'px',
            },
        }

        return (
            // <Draggable>
                <fieldset id="PAGELAYOUT" style={style.wrapper} ref={this.wrapper_ref}>
                    <legend style={style.legend}>Page Layout</legend>
                    <div style={style.inner}>
                        <div style={style.parameter_area}>                             

                            {this.parameters}       

                            <button style={style.button} onClick={this.generatePDF}>generate</button>
                            <button style={style.button} onClick={this.savePDF}>save</button>
                        </div>
                        <div style={page_style.two_pages}>
                            <div style={{...page_style.page, ...page_style.left_page}}>
                                <div style={page_style.content_area_left}>{this.canvas}</div>
                            </div>
                            <div style={{...page_style.page, ...page_style.right_page}}>
                                <div style={page_style.content_area_right}>{this.canvas}</div>
                            </div>
                        </div>
                        <div>{this.state.currentPage}</div>
                    </div>
                </fieldset>
            // </Draggable>
        )
    }
});

export default PageLayout;