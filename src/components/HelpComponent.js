import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Panel from './ui/PanelComponent';

const HelpComponent = observer(class HelpComponent extends React.Component {

	static contextType = MainContext;

	constructor(props,context) {
		super(props);
		this.context = context;
	}

	render() {		
		this.store = this.context.store;

		return(
			<Panel
				collapsed={this.props.collapsed}
				title="Help" 
				style={{
					backgroundColor: 'black',
				}}
			>
				<div id="SPLASH">
					<h1>camogen</h1>
                    <p>hello! this is the <span style={{color: 'orange'}}>first build</span>. some, 
                        but not all features exist, and only 
                        some of those features work fully or
                        properly. this build is only meant to
                        be a preview and I would appreciate any
                        thoughts on the direction, design, and 
                        core functionality as it comes closer to
                        proper testing.
                    </p>
                    <h2>what is this?</h2>
                    <p>
                        camogen is a tool for creating graphics 
                        using WebGL. you can design WebGL shaders, 
                        combine them, and control them.
                    </p>
                    {/* <p>
                        it's parameter driven, 
                        allowing you to change aspects of each
                        effect.
                    </p>
                    <p>
                        each parameter can be driven manually, 
                        through a <em>control graph</em> or by
                        MIDI.
                    </p>
                    <p>
                        each effect or combination of effects can
                        be saved into a library.
                    </p> */}
                    <h2>try this</h2>
                    <ol>
                        <li>
                            under <em>graph</em>, click 'Glyph'.
                            this will put the Glyph effect in focus
                            so it can be edited. 
                        </li>
                        <li>
                            in the Glyph controls, under 'Shelf', double click on the 'x' input under 'scale'
                        </li>
                        <li>
                            under 'Editor', click 'Counter'
                        </li>
                    </ol>
				</div>
			</Panel>		
	    )
	}
});

export default HelpComponent;