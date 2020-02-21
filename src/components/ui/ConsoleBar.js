import React from 'react';
import { observer } from 'mobx-react';

import MainContext from '../../MainContext';

const style = {
	wrapper: {
		position: 'absolute',
		bottom:'0px',
		left:'0px',
		display:'flex',
		// alignItems:'flex-end',
		borderTop: '1px solid black',
		width: '100%',
		height: '35px',
	},

	version: {
		backgroundColor: 'black',
		padding: '5px',
		// height : '100%'
	},

	console: {
		width: '100%',
		height: '100%',
		zIndex: '0',
		backgroundColor: 'white',
	},

	input: {
		margin:'0',
		padding: '0px 5px',
		width: '100%',
		boxSizing: 'border-box',
		height: '100%',
		fontSize: '1.5em',
		border: 'none',	
		zIndex: '1',
		backgroundColor: 'transparent',
	},

	a: {
		textDecoration: 'none',
		color: 'white',
	},

	suggest: {
		color: 'gray',
		position: 'relative',
		bottom: '35px',
		pointerEvents: 'none',
		zIndex: '-2',
		backgroundColor: 'transparent',
	}
}

const ConsoleBar = observer(class ConsoleBar extends React.Component {

	static contextType = MainContext;

	componentDidMount() {
		this.ref.addEventListener('keydown', (e) => this.handleKeypress(e));
		this.ref.addEventListener('click', (e) => this.handleClick(e));
	}

	handleKeypress(e) {
		switch (e.code) {
			case "Enter":
				this.store.consoleChanged();
				break;
			case "Tab":
				this.store.consoleText = this.store.suggestText;
				e.preventDefault();
				break;
			default:
				break;
		}
	}

	handleClick(e) {
		this.store.consoleText = '';
	}

	handleChange(e) {
		this.store.consoleText = e.target.value
		this.store.suggest(e.target.value);
	}
		
	render() {
		this.store = this.context.store;

		return (
          <div style={style.wrapper}>
          	<div style={style.version}>
          		<a style={style.a} href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>	
          	</div>
            <div id="console" style={style.console}>
            	<input 
            		ref={(ref) => this.ref = ref}
            		style={{...style.input, ...this.store.consoleStyle}}
            		type="text"
            		placeholder={this.store.suggestText}
            		value={this.store.consoleText}
            		onChange={(e) => this.handleChange(e)}
            	/>
            	<input
            		readOnly
            		type="text"            		
            		style={{...style.input, ...this.store.consoleStyle, ...style.suggest}}
            		value={this.store.suggestText}
            	/>
            </div>            
          </div>
		);
	}
});

export default ConsoleBar;