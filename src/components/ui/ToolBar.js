import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';
// import fs from 'fs';
const fs = require('fs');
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

    handleNew = () => {
        this.setState(previousState => ({
            ...previousState,
            openDrawer: !previousState.openDrawer,
            activeDrawer: 'new',
        }));

        this.drawer_items = (
            <button 
                className="white_button"  
                onClick={()=>this.store.addTarget()}
            >
                Target
            </button>
        );
    }

    handleSave = () => {        
        this.context.store.save();
    }

    handleLoad = () => {        
        this.context.store.load();
    }

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
                    onClick={()=>this.store.activeTarget.addShader(obj)}
                >
                    {obj}
                </button>
            ));
        }
    }

    render() {
        this.store = this.context.store;

        return (
            <div id="TOOLBAR">
                <div className="toolbar">
                    <button 
                        className={this.state.activeDrawer === 'new' ? "white_button" : "black_button"} 
                        onClick={this.handleNew}
                    >
                        NEW
                    </button>
                    <button 
                        className={this.state.activeDrawer === 'save' ? "white_button" : "black_button"} 
                        onClick={this.handleSave}
                    >
                        SAVE
                    </button>
                    <button 
                        className={this.state.activeDrawer === 'open' ? "white_button" : "black_button"}                         
                        onClick={this.handleLoad}
                    >                        
                        LOAD
                        
                    </button>
                    <button 
                        className={this.state.activeDrawer === 'obj' ? "white_button" : "black_button"} 
                        onClick={this.handleObj}
                    >
                        OBJ
                    </button>

                    <div className="version">
                        <a href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>
                    </div>
                </div>
                <div className="drawer" style={{
                    width: this.state.openDrawer ? '150px' : '0px',
                }}>
                    {this.drawer_items}
                </div>
            </div>                            
        );
    }
});

export default ToolBar;