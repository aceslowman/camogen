import React from "react";
import { TextComponent, GenericPanel, PagesContainer } from "maco-ui";

const Help = props => {
  return (
    <GenericPanel panel={props.panel}>
      <PagesContainer>
        <TextComponent>
          <h1>camogen</h1>
          <p>
            Hello! Thanks for trying <span style={{ color: "orange" }}>camogen</span>.
            It's currently in beta so some features will not be totally functional and 
            the structure of the system is still changing. 
          </p>   
          <p>
            <span style={{ color: "orange" }}>camogen</span> is a tool for creating
            visual art. It includes a library of inputs and effects (WebGL Shaders) that can be 
            combined in a graph system, and each individual effect parameter can be tweaked
            or driven by another graph subsystem.
          </p>   
          <p>
            I want camogen to be approachable and accessible whether or not you know how to 
            program graphics shaders. If you see any way to improve the project in that way,
            let me know.
          </p>
        </TextComponent>
        <TextComponent>
          <h2>adding effects</h2>
          
          <p>
            Individual effects in camogen (and webgl in general) are called <em>shaders</em>, 
            and each shader can be composed within the Shader Graph system.
          </p>
          
          <p>
            To add a new effect, first right click on the 'next' node and open up the Library.
            Every effect in camogen is organized in this library and they are organized by category.
            Start by clicking on Effects and then Glyph. You should now see a pattern appear!
          </p>
          
          <p>
            Next, 
          </p>
          
          
        </TextComponent>
        <TextComponent>
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
