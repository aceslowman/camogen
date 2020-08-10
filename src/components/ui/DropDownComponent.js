import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import styles from './DropDownComponent.module.css';

let style = {
    drawer: {
        width: "0px",
        top: "0px",
        left: "0px",
    }
}

export default @observer class DropDownComponent extends React.PureComponent {
    static contextType = MainContext;
    
    constructor() {
        super();

        this.ref = React.createRef();

        this.state = {
            activeItem: null,
            subDropDownItems: null,
            subDropDownOpen: false,
            subDropDownPosition: {
                top: 0,
                left: 0
            }
        }
    }

    handleDirClick = (e, index, item) => {
        let items = [];

        this.setState(prevState => {
            let toggle = index === prevState.activeItem ?
                !prevState.subDropDownOpen :
                true;

            let parent_bounds = this.ref.current.getBoundingClientRect();
            let bounds = e.getBoundingClientRect();

            return ({
                activeItem: toggle ? index : null,
                subDropDownItems: item.items,
                subDropDownOpen: toggle,
                subDropDownPosition: {
                    top: bounds.y,
                    // top: parent_bounds.y, // snap child to top of dropdown
                    left: parent_bounds.x + bounds.width
                }
            })
        });
    }

    handleClickAway = e => {
        if (!this.ref.current.contains(e.target)) {
            this.setState({
                dropDownOpen: false,
                activeItem: null
            });
        }
    }

    componentDidUpdate(){
        /*
            this will make sure that the
            subdropdown closes when the main
            dropdown closes. prevents the 
            dropdown from reopening with open
            subdropdowns
        */
        if (!this.props.open) this.setState({
            subDropDownOpen: false,
            activeItem: null
        })
    }
	
	render() {
        this.store = this.context.store;
        
        style = {
            ...style,
            drawer: {
                width: this.props.open ? '150px' : '0px',
                top: this.props.position.top,
                left: this.props.position.left
            }
        };

		return(
            <div 
                className={styles.drawer}
                style={style.drawer}
                ref={this.ref}
            >			
                {this.props.items && this.props.items.map((item,i)=>{
                    if(item._isDirectory) {         
                        return (
                            <React.Fragment key={i}>
                                <button
                                    key={i}
                                    className={i === this.state.activeItem ? styles.activeButton : 'white_button'}
                                    onClick={e=>this.handleDirClick(e.target,i,item)}
                                >
                                    {item.label} 
                                    <span style={{float:'right'}}>{'>'}</span>
                                </button>
                                <DropDownComponent 
                                    key={i+'dd'}
                                    open={this.props.open && this.state.subDropDownOpen}                                    
                                    items={this.state.subDropDownItems}
                                    position={this.state.subDropDownPosition}                                    
                                />
                            </React.Fragment>                            
                        )
                    }else{
                        return (
                            <button
                                key={i}
                                className="white_button"  
                                onClick={item.onClick}
                            >
                                {item.label}
                            </button>
                        )
                    }
                })}
            </div>
	    )
	}
};