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

const style = {
    wrapper: {
        padding: '0px',
        border: '1px dashed white',
        margin: '15px',
        // width: '100%',
        // minHeight: '500px',
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
    two_pages: {
        display: 'flex',
        flexFlow: 'row',
        border: '1px dashed black',
        backgroundColor: 'white',
        height: '500px',
        width: '600px',        
    },
    left_page: {
        display: 'flex',
        flexFlow: 'row',
        justifyContent: 'flex-end',
        padding: '30px',
        border: '1px dashed black',
        width: '50%',
    },
    right_page: {
        display: 'flex',
        flexFlow: 'row',
        justifyContent: 'flex-start',
        padding: '30px',
        border: '1px dashed black',
        width: '50%',        
    },
    content_area: {
        width: '85%',
        height: '95%',
        border: '1px dashed black',
        backgroundColor: '#eee',
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
                                    value={this.value}
                                    // name={"none"}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick}
                                />
                            </fieldset>
                        </div>
                        <div style={style.two_pages}>
                            <div style={style.left_page}>
                                <div style={style.content_area}></div>
                            </div>
                            <div style={style.right_page}>
                                <div style={style.content_area}></div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </Draggable>
        )
    }
});

export default PageLayout;