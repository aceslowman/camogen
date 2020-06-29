import React from 'react';
import MainContext from '../MainContext';
import { observer } from 'mobx-react';
import Toolbar from './ToolbarComponent';
import styles from './PanelGroupComponent.module.css';
import { ResizableBox } from 'react-resizable';

export default @observer class PanelGroupComponent extends React.Component {
	static contextType = MainContext;

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.state = {			
			width: props.defaultWidth ? props.defaultWidth : 1200,
			height: props.defaultHeight ? props.defaultHeight : 750,
			fullscreen: false,
		};
	}

	handleResize = (event, {element, size, handle}) => {
		this.setState({width: size.width, height: size.height});
	};

	handleExpand = (e) => {
		this.setState(prevState => ({
			...prevState,
			fullscreen: e ? true : !prevState.fullscreen
		}));
	}

    handleSnapshot = () => this.context.store.snapshot();

    handleBreakout = () => {
        this.context.store.breakout();
        this.handleExpand(true);
    };

    handleSave = () => this.context.store.scenes[0].save();

    handleLoad = () => this.context.store.scenes[0].load();

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
        for (let name in this.store.shader_list){               
            this.drawer_items.push((
                <button 
                    key={name}
                    className="white_button"  
                    onClick={()=>this.store.scenes[0].shaderGraphs[0].setSelectedByName(name)}
                >
                    {name}
                </button>
            ));
        }
    }
	
	render() {	
		const { children } = this.props;	

		this.store = this.context.store;
          
		return(
			<ResizableBox
				className={`${styles.panel_group} ${this.state.fullscreen ? styles.fullscreen : ''}`}
				height={this.state.height}
				width={this.state.width} 
				onResize={this.onResize} 
				resizeHandles={this.state.fullscreen ? [] : ['e','se','s']}
				minConstraints={[400,400]}
				// maxConstraints={[1000,1000]}
			>
				<div>


				{/* <Rnd
					className={`${styles.panel_group} ${this.state.fullscreen ? styles.fullscreen : ''}`}
					minWidth={500}
					minHeight={400}
					disableDragging
					maxWidth="100%"
					maxHeight="100%"
					bounds='#WORKAREA_inner'
					// default={{
					// 	x: Math.floor((window.innerWidth / 2) - 325),
					// 	y: Math.floor((window.innerHeight / 2) - 325),
					// 	width: '650px',
					// 	height: '650px'
					// }}
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
				> */}

					<Toolbar 
						drawer={this.drawer_items}
						activeDrawer={this.state.activeDrawer}
						openDrawer={this.state.openDrawer}
						drawerPosition={this.state.drawerPosition}
					>
						<div ref={this.ref}>
							{/* <button 
								className="large symbol drag_handle"
							>
								≡
							</button> */}
							<button 
								title={this.state.fullscreen ? 'shrink' : 'expand'}
								className={"large_symbol"} 
								onClick={()=>this.handleExpand()}
							>
								{this.state.fullscreen ? '⊡' : '⧈'}
							</button>
							<button 
								// className={"large_symbol"} 
								onClick={()=>this.store.scenes[0].clear()}
							>
								CLEAR
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
				{/* </Rnd> */}
				</div>

			</ResizableBox>
	    );
	}
};