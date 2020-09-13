import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
    PanelComponent,
    TextComponent,
} from 'maco-ui';

const Help = (props) => {
    const store = useContext(MainContext).store;

    const handleRemove = () => store.workspace.removePanel('Help')

    return(
        <PanelComponent
            title="Help" 
            onRemove={handleRemove}
            defaultSize={props.defaultSize}
            vertical
        >
            <TextComponent>
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
            </TextComponent>					
        </PanelComponent>		
    )
}

export default Help;