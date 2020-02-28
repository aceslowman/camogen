import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './Parameter';
import NodeContainer from './ui/NodeContainer';
import Draggable from 'react-draggable';
import InputBool from '../components/input/InputBool';
import InputFloat from '../components/input/InputFloat';

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
        padding: '15px', 
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
    }
};

const PageLayout = observer(class PageLayout extends React.Component {

    static contextType = MainContext;

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
            },
            page: {
                display: 'inline-flex',
                flexFlow: 'row',
                border: '1px dashed black',
                width: this.store.page.width,
                height: this.store.page.height,
            },
            left_page: {
                justifyContent: 'flex-end',
            },
            right_page: {
                justifyContent: 'flex-start',
            },
            content_area: {
                display: 'inline-block',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px dashed black',
                backgroundColor: '#eee',
                margin: this.store.page.margin,
            },
        }

        return (
            <Draggable>
                <fieldset style={style.wrapper}>
                    <legend style={style.legend}>Page Layout</legend>
                    <div style={style.inner}>
                        <div style={style.parameter_area}>

                            <fieldset style={parameter_style.fieldset}>
                                <legend className="invert" style={parameter_style.legend}>Margin</legend>                    
                                <InputFloat
                                    style={parameter_style.input}
                                    step={0.1}
                                    value={this.store.page.margin}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick}
                                />
                            </fieldset>

                            <fieldset style={parameter_style.fieldset}>
                                <legend className="invert" style={parameter_style.legend}>Width</legend>                    
                                <InputFloat
                                    style={parameter_style.input}
                                    step={0.1}
                                    value={this.store.page.width}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick}
                                />
                            </fieldset>

                            <fieldset style={parameter_style.fieldset}>
                                <legend className="invert" style={parameter_style.legend}>Height</legend>                    
                                <InputFloat
                                    style={parameter_style.input}
                                    step={0.1}
                                    value={this.store.page.height}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick}
                                />
                            </fieldset>  

                            <fieldset style={parameter_style.fieldset}>
                                <legend className="invert" style={parameter_style.legend}>DPI</legend>                    
                                <InputFloat
                                    style={parameter_style.input}
                                    step={0.1}
                                    value={this.store.page.dpi}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick}
                                />
                            </fieldset>                                                        
                        </div>
                        <div style={page_style.two_pages}>
                            <div style={{...page_style.page, ...page_style.left_page}}>
                                <div style={page_style.content_area}></div>
                            </div>
                            <div style={{...page_style.page, ...page_style.right_page}}>
                                <div style={page_style.content_area}></div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </Draggable>
        )
    }
});

export default PageLayout;