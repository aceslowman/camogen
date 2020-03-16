import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

const style = {
    wrapper: {
        display: 'flex',
        flexFlow: 'row',
        height: '100%',        
    },

    toolbar: {
        display: 'flex',
        flexFlow: 'column wrap',
        backgroundColor: 'black',
        color: 'white',        
    },

    drawer: {
        display: 'flex',
        flexFlow: 'column wrap',
        backgroundColor: 'white',
        color: 'black',
        borderRight: '1px dotted black',
        width: '0px',
        overflow: 'hidden',
    },    

    black_button: {
        padding: '10%',
        color: 'white',
        backgroundColor: 'black',
        border: 'none',
        borderBottom: '1px solid white',
        borderBox: 'content-box',
        cursor: 'pointer',
    },
    
    white_button: {
        padding: '4px 20px',
        color: 'black',
        backgroundColor: 'white',
        border: 'none',
        borderBottom: '1px solid black',
        borderBox: 'content-box',
        textAlign: 'left',
        cursor: 'pointer',
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

    constructor(){
        super();

        this.drawer_items = [];

        this.state = {
            openDrawer: false,
            activeDrawer: ''
        }
    }

    handleNew = () => {console.log("handleNew")}

    handleSave = () => {console.log("handleSave")}

    handleOpen = () => {console.log("handleOpen")}

    handleObj = () => {
        this.setState(previousState => ({
            ...previousState,
            openDrawer: !previousState.openDrawer,
            activeDrawer: 'obj',
        }));

        this.drawer_items = [];

        // retrieve master list of objects
        for (let obj of this.store.object_list){   
            let t = this.store.targets[0];

            this.drawer_items.push((
                <button 
                    key={obj}
                    className="white_button" 
                    style={style.white_button} 
                    onClick={()=>this.store.addShader(t,obj)}
                >
                {obj}
                </button>
            ));
        }
    }

    render() {
        this.store = this.context.store;

        return (
            <div style={style.wrapper}>
                <div className="toolbar" style={style.toolbar}>
                    <button className="black_button" style={this.state.activeDrawer == 'new' ? style.white_button : style.black_button} onClick={this.handleNew}>NEW</button>
                    <button className="black_button" style={this.state.activeDrawer == 'save' ? style.white_button : style.black_button} onClick={this.handleSave}>SAVE</button>
                    <button className="black_button" style={this.state.activeDrawer == 'open' ? style.white_button : style.black_button} onClick={this.handleOpen}>OPEN</button>
                    <button className="black_button" style={this.state.activeDrawer == 'obj' ? style.white_button : style.black_button} onClick={this.handleObj}>OBJ</button>

                    <div style={style.version}>
                        <a style={style.a} href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>
                    </div>
                </div>
                <div className="drawer" style={{
                    ...style.drawer,
                    width: this.state.openDrawer ? '150px' : '0px',
                }}>
                    {this.drawer_items}
                </div>
            </div>                            
        );
    }
});

export default ToolBar;