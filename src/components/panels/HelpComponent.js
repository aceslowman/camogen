import React from "react";
import { TextComponent, GenericPanel, PagesContainer } from "maco-ui";

const Help = props => {
  return (
    <GenericPanel panel={props.panel}>
      <PagesContainer>
        <TextComponent>
          <h1>camogen</h1>
          <p>
            hello! this is <span style={{ color: "orange" }}>camogen</span>, an
            application that allows you to code, compose, tweak, and record visual
            effects. It is in beta and not all planned features will be present.
          </p>          
        </TextComponent>
        <TextComponent>
          <h2>add effects</h2>
          <ol>
            <li>
              under <em>graph</em>, right click on the 'next' node. select Library
              -> Color -> 2HSV
            </li>
          </ol>
          <h2>change parameters</h2>
          <ol>
            <li>
              under 'controls', click and drag on any of the parameters to change
              them.
            </li>
          </ol>

          <h2>add motion</h2>
          <ol>
            <li>
              under <em>graph</em>, click 'Glyph'. this will put the Glyph effect
              in focus so it can be edited.
            </li>
            <li>
              in the Glyph controls, under 'Shader Controls', right click on the
              'x' input under 'scale' and click 'edit parameter'
            </li>
            <li>under 'Editor', click 'Counter'</li>
          </ol>

          <h2>Roadmap</h2>
          <p></p>
        </TextComponent>
      </PagesContainer>      
    </GenericPanel>
  );
};

export default Help;
