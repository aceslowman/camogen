import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

import styles from './ToolbarComponent.module.css';

let style = {
    drawer: {
        width: "0px",
        top: "0px",
        left: "0px",
    }
}

const Toolbar = observer(class Toolbar extends React.Component {

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

    render() {
        this.store = this.context.store;

        // let bounds = e.currentTarget.getBoundingClientRect();

        style = {...style, drawer: this.props.drawerPosition};

        return (
            <div className={styles.toolbar} onClick={this.closeDrawer} ref={this.ref}>
                {this.props.children}
                
                <div className={styles.drawer} style={{
                    ...style.drawer,
                    width: this.props.openDrawer ? '150px' : '0px',
                }}>
                    {this.props.drawer}
                </div>
            </div>                            
        );
    }
});

export default Toolbar;