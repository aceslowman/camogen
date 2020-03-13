import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import NodeContainer from './ui/NodeContainer';
import Draggable from 'react-draggable';
import jsPDF from 'jspdf';

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
        width: '50px',
        height: '100px',
    },
    left_page: {
        justifyContent: 'flex-end',
    },
    right_page: {
        justifyContent: 'flex-start',
    },
    content_area: {
        width: '85%',
        height: '95%',
        border: '1px dashed black',
        backgroundColor: '#eee',
    },
};

const style = {
    wrapper: {
        padding: '0px',
        border: '1px dashed white',
        margin: '15px',
        // padding: '15px', 
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
    },
    parameter_area: {
        display: 'flex',
        flexFlow: 'column',
        margin: '15px',
        width: '75px',
    }
};

const PageLayout = observer(class PageLayout extends React.Component {

    static contextType = MainContext;

    constructor(){
        super();
        this.wrapper_ref = React.createRef();

        this.state = {
            width: 100,
            height: 200,
        }
    }         

    componentDidMount(){
        this.updateStyle();
    }

    handleCreate = () => {
        

        // let pdf = new jsPDF({
        //     orientation: 'portrait',
        //     unit: 'in',
        //     format: [this.store.page.width,this.store.page.height],
        // });

        // pdf.text('main title', 10, 10);
        // pdf.save('test.pdf');
    }

    updateStyle(){
        if(!this.wrapper_ref.current) return;

        const aspect = this.store.page.width.value / this.store.page.height.value;
        
        this.setState(previousState => ({
            height: this.wrapper_ref.current.clientHeight,
            width: this.wrapper_ref.current.clientHeight * aspect,
        }));
    }

    render() {
        const { data } = this.props;

        this.store = this.context.store;

        page_style = {
            ...page_style,
            two_pages: {
                display: 'inline-flex',
                flexFlow: 'row',
                border: '1px dashed black',
                backgroundColor: 'white',
                margin: '15px',
            },
            page: {
                display: 'inline-flex',
                flexFlow: 'row',
                border: '1px dashed black',
                height: this.state.height + 'px',
                width: this.state.width + 'px',
            },
            left_page: {
                justifyContent: 'flex-end',
            },
            right_page: {
                justifyContent: 'flex-start',
            },
            content_area: {
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                border: '1px dashed black',
                backgroundColor: '#eee',
                margin: this.store.page.margin.value + 'px',
            },
        }

        if (this.context.p5_instance.canvas) 
            this.canvas = this.context.p5_instance.canvas.cloneNode(true);

        return (
            // <Draggable>
                <fieldset style={style.wrapper} ref={this.wrapper_ref}>
                    <legend style={style.legend}>Page Layout</legend>
                    <div style={style.inner}>
                        <div style={style.parameter_area}>

                            <Parameter
                                name={"margin"}
                                data={this.store.page.margin}
                            />

                            <Parameter
                                name={"width"}
                                data={this.store.page.width}
                            />

                            <Parameter
                                name={"height"}
                                data={this.store.page.height}
                            />

                            <Parameter
                                name={"dpi"}
                                data={this.store.page.dpi}
                            />        

                            <button onClick={this.handleCreate}>save pdf</button>
                        </div>
                        <div style={page_style.two_pages}>
                            <div style={{...page_style.page, ...page_style.left_page}}>
                                <div style={page_style.content_area}>{this.canvas}</div>
                            </div>
                            <div style={{...page_style.page, ...page_style.right_page}}>
                                <div style={page_style.content_area}>{this.canvas}</div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            // </Draggable>
        )
    }
});

export default PageLayout;