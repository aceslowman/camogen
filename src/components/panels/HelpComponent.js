import React from "react";
import { TextComponent, GenericPanel, PagesContainer } from "maco-ui";

const Help = props => {
  return (
    <GenericPanel showTitle={false} panel={props.panel}>
      <PagesContainer>
        <TextComponent>
          <h1>camogen</h1>
          {/* <p>
            Hello! Thanks for trying{" "}
            <span style={{ color: "orange" }}>camogen</span>. It's currently in
            alpha so some features will not be totally functional and the
            structure of the system is still changing.
          </p> */}
          <p>
            <span style={{ color: "orange" }}>camogen</span> is a tool for
            creating visual art. It includes a library of inputs and effects
            that can be combined in a graph system, and each
            individual effect parameter can be tweaked or driven by another
            graph subsystem.
          </p>
          {/* <p>
            I want camogen to be approachable and accessible whether or not you
            know how to program graphics shaders. If you see any way to improve
            the project in that way, let me know.
          </p> */}
        </TextComponent>
        <TextComponent>
          <h2>Adding Effects</h2>

          <p>
            Individual effects in camogen (and webgl in general) are called{" "}
            <em>shaders</em>, and each shader can be composed within the Shader
            Graph system.
          </p>

          <p>
            To add a new effect, first right click on the 'next' node and open
            up the Library. Every effect in camogen is organized in this library
            and they are organized by category. Start by clicking on Effects and
            then Glyph. You should now see a pattern appear!
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
            Your workspace in camogen is set to windowed mode by default, if you'd like the
            layout to fill the full screen, click the '*' in the top right corner of the main panel.
          </p>

          <p>
            Camogen has a number of layouts containing different panels. Explore
            each of these layouts by clicking on 'Layout' in the toolbar on the
            top of the page. You can also create and save your own layouts this way.
          </p>
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
        {/* <TextComponent>
          <h2>Roadmap</h2>
          <p>Below is the list of priorities. I'll cross things off this list as camogen is updated.</p>
          <ol>
            <li>Stable save system and shader collection.</li>
            <li>Stable <em>static</em> tools.</li>
            <li>Stable undo/redo.</li>
            <li>Stable motion graphs.</li>
            <li>MIDI control tools.</li>
            <li>Audio reactive tools.</li>
            <li>Print media tools.</li>
            <li>3D tools.</li>
          </ol>
        </TextComponent> */}
      </PagesContainer>
    </GenericPanel>
  );
};

export default Help;
