import React from 'react';
import { observer } from 'mobx-react';

const style = {
	wrapper: {
		position: 'absolute',
		bottom:'0px',
		left:'0px',
		display:'flex',
		alignItems:'flex-end',
		width: '50%',
		height : '35px',
	},

	version: {
		backgroundColor: 'black',
		padding: '5px',
		// height : '100%',
		// display: 'flex',
		// alignItems: 'center',
	},

	console: {
		width: '100%',
		height: '100%',
	},

	input: {
		margin:'0',
		padding: '0px 5px',
		width: '100%',
		boxSizing: 'border-box',
		height: '100%',
		fontSize: '1.5em',
		// border: '1px solid black',
		border: 'none',		
		backgroundColor: 'none',
	},

	a: {
		textDecoration: 'none',
		color: 'white',

	},

	suggest: {
		color: 'gray',
		position: 'relative',
		bottom: '3.1em',
		pointerEvents: 'none',
		backgroundColor: 'transparent'
	}
}

const ConsoleBar = observer(class ConsoleBar extends React.Component {

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
		}
	}

	handleClick(e) {
		console.log(e);

	}

	handleChange(e) {
		this.store.consoleText = e.target.value
		this.store.suggest(e.target.value);
	}
		
	render() {
		this.store = this.props.store;

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
            		placeholder={this.store.consoleText}
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