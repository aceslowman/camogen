import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../MainContext';

let style = {
    drawer: {
        width: "0px",
        top: "0px",
        left: "0px",
    }
}

const ToolBar = observer(class ConsoleBar extends React.Component {

    static contextType = MainContext;

    constructor(){
        super();

        this.drawer_items = [];
        this.ref = React.createRef();

        this.state = {
            openDrawer: false,
            activeDrawer: ''
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickAway);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickAway);
    }

    handleClickAway = e => {
        if (!this.ref.current.contains(e.target)) {
        	this.setState({openDrawer: false, activeDrawer: ''})        	
        }
    }

    handleNew = (e) => {
        let bounds = e.currentTarget.getBoundingClientRect();
        
        this.setState(previousState => ({
            ...previousState,
            openDrawer: !(previousState.activeDrawer === 'new' && previousState.openDrawer),
            activeDrawer: 'new',
        }));

        style = {...style, drawer: {
            top: bounds.top-1,
            left: bounds.right,
        }}

        this.drawer_items = (
            <React.Fragment>
                <button 
                    onClick={()=>this.store.addTarget()} 
                    className="white_button"
                >Target
                </button>
                <button 
                    onClick={()=>this.store.activeTarget.addShader()} 
                    className="white_button"
                >Shader
                </button>
            </React.Fragment>            
        );
    }

    handleSave = () => this.context.store.save();

    handleLoad = () => this.context.store.load();

    handleLib = (e) => {
        let bounds = e.currentTarget.getBoundingClientRect();
        
        this.setState(previousState => ({
            ...previousState,
            openDrawer: !(previousState.activeDrawer === 'obj' && previousState.openDrawer),
            activeDrawer: 'obj',
        }));

        style = {...style, drawer: {
            top: bounds.top-1,
            left: bounds.right,
        }}

        this.drawer_items = [];

        // retrieve master list of objects
        for (let obj of this.store.object_list){               
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
            <div id="TOOLBAR" onClick={this.closeDrawer} ref={this.ref}>
                <div className="toolbar">
                    <button 
                        className={
                            (this.state.activeDrawer === 'new' && this.state.openDrawer) 
                                ? "white_button" 
                                : "black_button"
                        } 
                        onClick={this.handleNew}
                    >
                        NEW
                    </button>
                    <button 
                        className={
                            (this.state.activeDrawer === 'save' && this.state.openDrawer) 
                                ? "white_button" 
                                : "black_button"
                        } 
                        onClick={this.handleSave}
                    >
                        SAVE
                    </button>
                    <button 
                        className={
                            (this.state.activeDrawer === 'open' && this.state.openDrawer) 
                                ? "white_button" 
                                : "black_button"
                        }                         
                        onClick={this.handleLoad}
                    >                        
                        LOAD
                        
                    </button>
                    <button 
                        className={
                            (this.state.activeDrawer === 'obj' && this.state.openDrawer) 
                                ? "white_button" 
                                : "black_button"
                        } 
                        onClick={this.handleLib}
                    >
                        LIB
                    </button>

                    <div className="version">
                        <a href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>
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