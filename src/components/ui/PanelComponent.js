import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import styles from './PanelComponent.module.css';
import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';


let style = {
	content: {},
	label: {}
}

const PanelComponent = observer(class PanelComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props); 		

		this.state = {
			active: props.active,
			expand: !props.collapsed,
			width: props.defaultWidth ? props.defaultWidth : 500,
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
			width: this.state.expand ? 'auto' : 'min-content',
		}

		style.label = {
			...style.label,	
			width: this.state.expand ? 'auto' : 'min-content',
		}
		
		return(
			<Draggable handle=".drag_handle">
				<div>
					<ResizableBox
						className={styles.panel} 
						height={this.state.height} 
						width={this.state.expand ? this.state.width : 20} 
						onResize={this.onResize} 
						resizeHandles={['se','e','s']}
						minConstraints={[170,170]}
						maxConstraints={[1000,1000]}
					>
						
							<div className={"drag_handle "+styles.panel_buttons} style={style.toolbar}>

								{ this.props.onRemove && (
									<button onClick={this.props.onRemove}>
										x
									</button>
								)}

								<button onClick={this.handleExpand}>
									{
										this.state.expand ? '>' : 'v'
									}
								</button>

								{/* <button className="drag_handle">
									≡
								</button> */}

								<legend style={style.label} onClick={this.props.onFocus}> 
									{this.props.title}
								</legend>
							</div>                    

							{this.state.expand && (
								<div style={{...this.props.style, ...style.content}} className={styles.panel_content + ' ' + this.props.className} ref={this.props.onRef}>
									{this.props.children}	
								</div>
							)}
							
					</ResizableBox>	
				</div>				
			</Draggable>					
	    )
	}
});

export default PanelComponent;