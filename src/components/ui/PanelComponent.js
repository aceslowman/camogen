import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import styles from './PanelComponent.module.css';

let style = {
	content: {
		maxWidth: '500px'
	},
	label: {}
}

const PanelComponent = observer(class PanelComponent extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props); 		

		this.state = {
			active: props.active,
			expand: !props.collapsed
		};
	}

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			expand: !prevState.expand,
		}));
	}

	render() {
		style.container = {
			...style.container,
			flexFlow: this.state.expand ? 'column' : 'row',
			// height: this.state.expand ? 'auto' : '100%',
		}

		style.content = {
			...style.content,
			maxWidth: this.state.expand ? '500px' : '0px',
		}

		style.toolbar = {
			...style.toolbar,
			flexFlow: this.state.expand ? 'row' : 'column',
			height: this.state.expand ? 'auto' : '100%',			
		}

		style.label = {
			...style.label,
			width: this.state.expand ? 'auto' : 'min-content',
		}
		
		return(
			<div className={styles.panel}>
				<div className={styles.panel_buttons} style={style.toolbar}>

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

					<legend style={style.label} onClick={this.props.onFocus}> 
						{this.props.title}
					</legend>
				</div>                    

				{this.state.expand && (
					<div style={{...this.props.style, ...style.content}} className={styles.panel_content + ' ' + this.props.className} ref={this.props.onRef}>
						{this.props.children}	
					</div>
				)}
				              
			</div>
	    )
	}
});

export default PanelComponent;