import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

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
          <div id="CONSOLE">
				<div>
					<input
						ref={(ref) => this.ref = ref}
						style={this.store.consoleStyle}
						type="text"
						placeholder={this.store.suggestText}
						value={this.store.consoleText}
						onChange={(e) => this.handleChange(e)}
					/>
					<input
						readOnly
						type="text"
						id="suggest"
						style={this.store.consoleStyle}
						value={this.store.suggestText}
					/>
				</div>      
          </div>
		);
	}
});

export default ConsoleBar;