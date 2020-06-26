import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import styles from './ConsoleBarComponent.module.css';

// for electron
const remote = window.require('electron').remote;
const app = remote.app;

export default @observer class ConsoleBar extends React.Component {

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
          <div className={styles.console}>
			  
				<div className={styles.version}>
					<a href="https://github.com/aceslowman/camogen">v{app.getVersion()}</a>
				</div>
				
				<div className={styles.console_inputs}>
					<input
						ref={(ref) => this.ref = ref}
						style={this.props.data.consoleStyle}
						type="text"
						placeholder={this.props.data.suggestText}
						value={this.props.data.consoleText}
						onChange={(e) => this.handleChange(e)}
					/>
					<input
						readOnly
						type="text"
						id="suggest"
						style={this.props.data.consoleStyle}
						value={this.props.data.suggestText}
					/>
				</div>      
          </div>
		);
	}
};