import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import styles from './ToolbarComponent.module.css';
import DropDownComponent from './DropDownComponent';

export default @observer class ToolbarComponent extends React.Component {

    static contextType = MainContext;

    constructor(){
        super();

        this.drawer_items = [];
        this.ref = React.createRef();

        this.state = {
            activeItem: null,
            dropDownItems: null,
            dropDownOpen: false,
            dropDownPosition: {
                top: 0,
                left: 0
            }
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
        	this.setState({
                dropDownOpen: false, 
                activeItem: null
            });        	
        }
    }

    handleItemClick = (e,index,item) => {
        this.setState(prevState=>{
            let toggle = index === prevState.activeItem ?
                !prevState.dropDownOpen :
                true;

            let parent_bounds = this.ref.current.getBoundingClientRect();            
            let bounds = e.getBoundingClientRect();

            return ({
                activeItem: toggle ? index : null,
                dropDownItems: item.dropDown,
                dropDownOpen: toggle,
                dropDownPosition: {
                    top: bounds.y + bounds.height,
                    left: bounds.x
                }
            })
        });
        
        if(item.onClick) item.onClick();
    }

    render() {
        this.store = this.context.store;

        return (
            <div 
                className={styles.toolbar} 
                onClick={this.closeDrawer} 
                ref={this.ref}
            >
                {this.props.items.map((item,i)=>{
                    return (
                        <button
                            key={i}
                            className={i === this.state.activeItem ? styles.activeButton : ''}
                            onClick={(e)=>this.handleItemClick(e.target,i,item)}
                        >
                            {item.label}                            
                        </button>
                    )
                })}

                {/*            
                    currently the toolbar owns a single dropdown.
                    
                    I see an alternative in using a single dropdown
                    at the root component, but that would not allow
                    multiple concurrent dropdowns, not sure if it's
                    preferable yet.
                */}
                <DropDownComponent 
                    open={this.state.dropDownOpen}                                    
                    items={this.state.dropDownItems}
                    position={this.state.dropDownPosition}
                />
            </div>                            
        );
    }
};