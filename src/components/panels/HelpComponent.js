import React from "react";
import { TextComponent, GenericPanel, PagesContainer } from "../../ui";

const Help = props => {
  return (
    <GenericPanel showTitle={false} panel={props.panel}>
      <PagesContainer>
        <TextComponent>
          <h1>camogen</h1>
          <p>
            <span style={{ color: "orange" }}>camogen</span> is a tool for
            creating visual art. It includes a library of inputs (i.e. images, videos, webcam) and effects (i.e. threshold, blur, invert)
            that can be combined using a graph system. You can either use pre-built effects or program your own within camogen using the 
            GLSL shader language.
          </p>
          <p>You can read a short tutorial by clicking the {`<`+ ' and '+`>`} at the bottom of this textbox.</p>
          <p style={{ color: "crimson", fontSize: "1em" }}>
            Note: for the time being, camogen works best in Chrome. If you run into any issues, please let me know at <a style={{color:'skyblue'}} href="https://aceslowman.itch.io/camogen/community">the itch.io community page.</a>
          </p>
        </TextComponent>
        <TextComponent>
          <h2>Adding Effects</h2> 
          <p>
            Individual effects in camogen (and webgl in general) are called{" "}
            <em>shaders</em>, and each shader can be composed within camogen's shader graph system. In camogen, 
          </p>
          <p>
            To add a new effect, first right click on the 'next' node and open
            up the Library. Every effect in camogen is organized in this library
            and they are organized by category. Start by selecting a shader, for example, Effects and
            then Glyph. You should now see a pattern appear! If the effect requires some kind of input, camogen will generate empty slots for you to add other generators and effects.
          </p>
          <p>
            This 'Glyph' effect can be altered within the 'Shader Controls'. Try
            clicking and dragging on some of these numbers.
          </p>
          <p>
            Next, add some color by right clicking on the 'next' node and
            selecting Color/HSV2RGB. Follow this with one of the nodes under
            Math and you can see that the effects can begin to branch.
          </p>
          <p>
            You can swap out any effect with another, but you can also add new
            nodes in between by clicking the '+' button between each node.
          </p>
          <p>
            Nodes can be deleted with the 'delete' key, or by selecting 'Delete'
            after right-clicking a node.
          </p>
        </TextComponent>
        <TextComponent>
          <h2>Navigating the Interface</h2>
          <p>
            Camogen's panels can either float or be organized in a split layout.
            Try resizing the individual panels or right click on the space between panels.
          </p>
          <p>
            Your workspace in camogen is set to fullscreen mode by default, if you'd like the
            layout to be windowed, click the '*' in the top right corner of the main panel.
          </p>
          <p>
            Camogen has a number of layouts containing different panels. Explore
            each of these layouts by clicking on 'Layout' in the toolbar on the
            top of the page. You can also create and save your own layouts this way.
          </p>
          <p>Each panel in the layout can be changed into a different panel by clicking the downward pointing arrow to the right of the current panel name (i.e. "Help"). </p>
        </TextComponent>
        <TextComponent>
          <h2>Adding Motion</h2>
          <p>  
            You can right click on any (number) parameter under Shader
            Controls and click 'Edit Parameter', which will add a new
            'Parameter Editor'. This graph works the same as the Shader Graph,
            but is used to shape changing values.
          </p>
        </TextComponent>
        <TextComponent>
          <h2>Caveats</h2>
          <p>  
            Camogen is still being updated and contains some bugs. Export your images and save often, and consider
            saving your shaders as you go to prevent loss of data. Be willing to lose things. If you run into any issues, please let me know at <a style={{color:'skyblue'}} href="https://aceslowman.itch.io/camogen/community">the itch.io community page.</a> (please!)
          </p>
        </TextComponent>
      </PagesContainer>
    </GenericPanel>
  );
};

export default Help;
