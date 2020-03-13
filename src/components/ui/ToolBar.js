import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

const style = {
    wrapper: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column wrap',
        backgroundColor: 'black',
        borderRight: '1px solid white',
        color: 'white',
        boxSizing: 'content-box',
    },

    button: {
        padding: '10%',
        color: 'white',
        backgroundColor: 'black',
        border: 'none',
        borderBottom: '1px solid white',
        boxSizing: 'content-box',
    },

    version: {
        backgroundColor: 'black',
        padding: '5px',
        width: '26px',
        position: 'absolute',
        bottom: '5px',
        left: '-3px',
    },

    a: {
        textDecoration: 'none',
        color: 'white',
        padding: '5px',
        paddingLeft: 'none',
    },
}

const ToolBar = observer(class ConsoleBar extends React.Component {

    static contextType = MainContext;


    handleNew = () => {
        console.log("handleNew");

    }

    handleSave = () => {
        console.log("handleSave");

    }

    handleOpen = () => {
        console.log("handleOpen");

    }

    handleObj = () => {
        console.log("handleObj");
        
    }

    render() {
        this.store = this.context.store;

        return (
            <div className="toolbar" style={style.wrapper}>
                <button className="black_button" style={style.button} onClick={this.handleNew}>NEW</button>
                <button className="black_button" style={style.button} onClick={this.handleSave}>SAVE</button>
                <button className="black_button" style={style.button} onClick={this.handleOpen}>OPEN</button>
                <button className="black_button" style={style.button} onClick={this.handleObj}>OBJ</button>

                <div style={style.version}>
                    <a style={style.a} href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>
                </div>
            </div>
        );
    }
});

export default ToolBar;