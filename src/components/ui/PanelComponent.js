import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import styles from './PanelComponent.module.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

let style = {
	content: {},
	label: {}
}

export default @observer class PanelComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props); 		

		this.state = {
			active: props.active,
			expand: !props.collapsed,
			width: props.defaultWidth ? props.defaultWidth : 400,
			height: props.defaultHeight ? props.defaultHeight : 500,
		};
	}

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			expand: !prevState.expand,
		}));
	}

	onResize = (event, {element, size, handle}) => {
    	this.setState({width: size.width, height: size.height});
  	};

	render() {
		style.container = {
			...style.container,
			// width: this.state.width,
			// height: this.state.height,
			// maxWidth: this.state.expand ? this.state.width : '0px',
		}

		style.toolbar = {
			...style.toolbar,
			flexFlow: this.state.expand ? 'row' : 'column',
			height: this.state.expand ? 'auto' : '100%',
			// width: this.state.expand ? 'auto' : 'min-content',
		}

		style.label = {
			...style.label,	
			width: this.state.expand ? 'auto' : 'min-content',
		}
		
		return(
			<div 
				style={this.props.style}
				className={`${styles.panel} ${this.state.expand ? styles.expanded : styles.collapsed}`}
			>
				<div className={styles.panel_buttons} style={style.toolbar}>

					{ this.props.onRemove && (
						<button 
							className="large_symbol" 
							onClick={this.props.onRemove}
						>
							x
						</button>
					)}

					<button 
						title={this.state.expand ? 'collapse' : 'expand'}
						className="large_symbol" 
						onClick={this.handleExpand}
					>
						{
							this.state.expand ? '↤' : '↦'
						}
					</button>

					<legend style={style.label} onClick={this.props.onFocus}> 
						<strong>{this.props.title}</strong>
					</legend>
				</div>                    

				{this.state.expand && (
					<div style={{...style.content}} className={styles.panel_content + ' ' + this.props.className} ref={this.props.onRef}>
						{this.props.children}	
					</div>
				)}
			</div>													
	    )
	}
};