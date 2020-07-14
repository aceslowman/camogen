import React from 'react';
import MainContext from '../MainContext';
import { observer } from 'mobx-react';
import Toolbar from './ToolbarComponent';
import styles from './PanelGroupComponent.module.css';
import { ResizableBox } from 'react-resizable';

export default @observer class PanelGroupComponent extends React.Component {
	drawer_items = [];

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

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			fullscreen: !prevState.fullscreen
		}));
	}

    handleBreakout = () => {
        this.context.store.breakout();
        this.handleExpand(true);
    };

    handleLib = () => {
		let keys = Object.keys(this.store.shader_list);

		keys.sort((a,b)=>{
			return a._isDirectory ? 1 : -1
		})

		return keys.map((name)=>{
			let item = this.store.shader_list[name];

			if (item._isDirectory) {
				let subItems = [];

				for (let name in item) {
					if (name == '_isDirectory') continue;
					subItems.push({
						label: name,
						onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName(name)
					});
				}

				return {
					_isDirectory: true,
					label: name,					
					items: subItems
				};
			} else {
				return {
					label: item.name,
					onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName(item.name)
				};
			}
		});
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
					<Toolbar 
						items={[
							{
								label: "SAVE",
								onClick: this.context.store.scenes[0].save
							},
							{
								label: "LOAD",
								onClick: this.context.store.scenes[0].load
							},
							{
								label: "CLEAR",
								onClick: this.store.scenes[0].clear
							},
							{
								label: "EXPAND",
								symbol: this.state.fullscreen ? '⊡' : '⧈',
								onClick: this.handleExpand
							},
							{
								label: "LIBRARY",
								dropDown: this.handleLib()
							},
							{
								label: "SNAPSHOT",
								onClick: this.context.store.snapshot
							},
							{
								label: "BREAKOUT",
								onClick: this.handleBreakout
							},
						]}
					/>
					<div className={styles.panel_group_container}> 	                
						{children}
					</div>
				</div>

			</ResizableBox>
	    );
	}
};