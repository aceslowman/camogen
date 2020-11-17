import React from 'react';
import {
    TextComponent,
    GenericPanel
} from 'maco-ui';

const Help = (props) => {
    return(
        <GenericPanel panel={props.panel}>
            <TextComponent>
                <h1>camogen</h1>
                <p>hello! this is <span style={{color: 'orange'}}>camogen</span>, 
                  an application that allows you to code, compose, tweak, and record visual effects. 
                  It is in beta and not all planned features will be present.
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
              
                <h2>Roadmap</h2>
                <p></p>
            </TextComponent>			
        </GenericPanel>
    )
}

export default Help;