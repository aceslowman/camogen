import React from 'react';
import MainContext from '../../MainContext';
import { observer } from 'mobx-react';
import { ResizableBox } from 'react-resizable';
import Toolbar from './ToolbarComponent';

import styles from './PanelGroupComponent.module.css';
import Draggable from 'react-draggable';
import {Rnd} from 'react-rnd';


const PanelGroupComponent = observer(class PanelGroupComponent extends React.Component {
	static contextType = MainContext;

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.state = {			
			width: props.defaultWidth ? props.defaultWidth : 500,
			height: props.defaultHeight ? props.defaultHeight : 500,
			fullscreen: false,
		};
	}

	handleResize = (event, {element, size, handle}) => {
		// console.log(event)
		this.setState({width: size.width, height: size.height});
	};

	handleExpand = (e) => {
		this.setState(prevState => ({
			...prevState,
			fullscreen: e ? true : !prevState.fullscreen
		}));
	}

	handleNew = (e) => {        
		let p_bounds = this.ref.current.getBoundingClientRect();
		let bounds = e.currentTarget.getBoundingClientRect();

		this.setState(previousState => ({
			...previousState,
			openDrawer: !(previousState.activeDrawer === 'new' && previousState.openDrawer),
			activeDrawer: 'new',
			drawerPosition: {
				left: bounds.left - p_bounds.left
			}
		}));    

        this.drawer_items = (
            <React.Fragment>
                <button 
                    onClick={()=>this.store.resetAndClear()} 
                    className="white_button"
                >Project
                </button>                
            </React.Fragment>            
        );
    }

    handleSnapshot = () => this.context.store.snapshot();

    handleBreakout = () => {
        this.context.store.breakout();
        this.props.handleExpand(true);
    };

    handleSave = () => this.context.store.save();

    handleLoad = () => this.context.store.load();

    handleLib = (e) => {
		let p_bounds = this.ref.current.getBoundingClientRect();
		let bounds = e.currentTarget.getBoundingClientRect();
        
        this.setState(previousState => ({
            ...previousState,
            openDrawer: !(previousState.activeDrawer === 'obj' && previousState.openDrawer),
			activeDrawer: 'obj',
			drawerPosition: {
				left: bounds.left - p_bounds.left
			}
        }));

        this.drawer_items = [];

        // retrieve master list of objects
        for (let obj in this.store.shader_list){               
            this.drawer_items.push((
                <button 
                    key={obj}
                    className="white_button"  
                    onClick={()=>{
                        let shader = this.store.getShader(obj);
                        this.store.activeGraph.activeNode.setData(shader);
                    }}
                >
                    {obj}
                </button>
            ));
        }
    }
	
	render() {	
		const { children } = this.props;	

		this.store = this.context.store;
          
		return(
			<Rnd
				className={`${styles.panel_group} ${this.state.fullscreen ? styles.fullscreen : ''}`}
				minWidth={500}
				minHeight={400}
				bounds='#WORKAREA_inner'
				default={{
					x: Math.floor((window.innerWidth / 2) - 325),
					y: Math.floor((window.innerHeight / 2) - 325),
					width: '650px',
					height: '650px'
				}}
				dragHandleClassName='drag_handle'
				enableResizing={{
					bottom: true,
					bottomLeft: false,
					bottomRight: true,
					left: false,
					right: true,
					top: false,
					topLeft: false,
					topRight: false,
				}}
			>

				<Toolbar 
					drawer={this.drawer_items}
					activeDrawer={this.state.activeDrawer}
					openDrawer={this.state.openDrawer}
					drawerPosition={this.state.drawerPosition}
				>
					<div ref={this.ref}>
						<button 
							className="large symbol drag_handle"
						>
							≡
						</button>
						<button 
							title={this.state.fullscreen ? 'shrink' : 'expand'}
							className={"large_symbol"} 
							onClick={()=>this.handleExpand()}
						>
							{this.state.fullscreen ? '⊡' : '⧈'}
						</button>
						<button 
							// className={"large_symbol"} 
							onClick={this.handleNew}
						>
							NEW
						</button>
						<button 
							// className={"large_symbol"} 
							onClick={this.handleSave}
						>
							SAVE
						</button>
						<button 
							// className={"large_symbol"}                         
							onClick={this.handleLoad}
						>                        
							LOAD							
						</button>
						<button 
							// className={"large_symbol"} 
							onClick={this.handleLib}
						>
							LIB
						</button>
						<button 
							// className={"large_symbol"} 
							onClick={this.handleSnapshot}
						>
							SNAP
						</button>
						<button 
							// className={"large_symbol"}  
							onClick={this.handleBreakout}
						>
							BREAKOUT
						</button>
					</div>
				</Toolbar>
				<div className={styles.panel_group_container}> 	                
					{children}
				</div>
			</Rnd>
	    );
	}
});

export default PanelGroupComponent; 