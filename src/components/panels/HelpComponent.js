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
          <h2>Adding Effects</h2>
          
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
            This 'Glyph' effect can be altered within the 'Shader Controls'. Try clicking and dragging
            on some of these numbers.
          </p>
          
          <p>
            Next, add some color by right clicking on the 'next' node and selecting Color/HSV2RGB.
            Follow this with one of the nodes under Math and you can see that the effects can begin
            to branch.
          </p>
          
          <p>
            You can swap out any effect with another, but you can also add new nodes in between 
            by clicking the '+' button between each node.
          </p>
          
          <p>
            Nodes can be deleted with the 'delete' key, or by selecting 'Delete' after right-clicking 
            a node.
          </p>                    
        </TextComponent>
        <TextComponent>
          <h2>Navigating the Interface</h2>
          <p>
            Camogen's panels can either float or be organized in a split layout. Try resizing the
            individual panels or click the rectangle next to the "Help" text above. 
          </p>
          <p>
            Your canvas in camogen is set to fullscreen by default, but if you'd like to move and resize
            the canvas individually, click the '*' in the upper left hand corner of the screen.
          </p>
          
          <p>
            Camogen has a number of layouts containing different panels. Explore each of these layouts
            by clicking on 'Layout' in the toolbar on the top of the page.
          </p>
        </TextComponent>
        <TextComponent>
          <h2>Adding Motion</h2>
          <p><em>For the time being, motion is limited. You can right click on any (number) parameter under 
            Shader Controls, click 'Edit', and </em></p>
        </TextComponent>
        <TextComponent>
          <h2>Roadmap</h2>
          <p></p>
        </TextComponent>
      </PagesContainer>      
    </GenericPanel>
  );
};

export default Help;
