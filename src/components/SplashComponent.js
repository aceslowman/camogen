import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/PanelComponent';

const Splash = observer(class Splash extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;
	}

	handleRemove = () => {		
		this.context.store.show_splash = false;
	}

	render() {		
		return(
			<Panel onRemove={this.handleRemove} style={{backgroundColor: 'black'}}>
				<div id="SPLASH">
					<h1>camogen</h1>
					<p><small>parametric synthesizer</small></p>										
					<sub style={{color: 'green'}}>completely unfinished edition</sub>					
				</div>
			</Panel>		
	    )
	}
});

export default Splash;