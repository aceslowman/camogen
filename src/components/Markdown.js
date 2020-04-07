import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/Panel';

const Markdown = observer(class Markdown extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;
	}

	handleRemove = () => {		
		// todo
	}

	render() {		
		return(
			<Panel onRemove={this.handleRemove} style={{backgroundColor: 'black'}}>
				<div id="Markdown">
					<h1>camogen</h1>
					<p><small>parametric synthesizer</small></p>										
					<sub style={{color: 'green'}}>completely unfinished edition</sub>					
				</div>
			</Panel>		
	    )
	}
});

export default Markdown;