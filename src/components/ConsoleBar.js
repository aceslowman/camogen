import React from 'react';
import { observer } from 'mobx-react';

const style = {
	wrapper: {
		position: 'relative',
		bottom:'0px',
		left:'0px',
		display:'flex',
		alignItems:'center',
		width: '100%'
	},

	version: {
		backgroundColor: 'black',
		padding: '5px',
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
	},

	a: {
		textDecoration: 'none',
		color: 'white',
	},

}

const ConsoleBar = observer(class ConsoleBar extends React.Component {
		
	render() {
		const store = this.props.store;

		return (
          <div style={style.wrapper}>
          	<div style={style.version}>
          		<a style={style.a} href="https://github.com/aceslowman/camogen"><sub>v1.0</sub></a>	
          	</div>
            <div style={style.console}>
            	<input 
            		style={style.input}
            		type="text"
            		placeholder={store.consoleText}
            		value={store.consoleText}
            		onChange={(e) => store.consoleChanged(e.target.value)}
            	/>
            </div>            
          </div>
		);
	}
});

export default ConsoleBar;