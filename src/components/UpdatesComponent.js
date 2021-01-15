import React, { useContext, useState } from "react";
import {
  InputSelect,
  InputBool,
  ThemeContext,
  PanelComponent,
  TextComponent,
  PagesContainer
} from "maco-ui";
import styles from "./SplashComponent.module.css";
import MainContext from "../MainContext";
import { observer } from "mobx-react";

const Splash = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [position, setPosition] = useState([
    window.innerWidth / 2 - 312,
    window.innerHeight / 2 - 212
  ]);
  const [dimensions, setDimensions] = useState([625, 425]);

  const handlePosition = setPosition;

  const handleDimensions = setDimensions;

  return (
    <PanelComponent
      position={position}
      dimensions={dimensions}
      onPositionChange={handlePosition}
      onDimensionsChange={handleDimensions}
      className={styles.wrapper}
      floating={true}
      //title="about"
      subtitle={
        <InputBool
          hLabel
          label="show on startup"
          checked={store.showSplash}
          onChange={e => {
            window.localStorage.setItem("showSplash", e);
            store.setShowSplash(e);
          }}
        />
      }
      showTitle={true}
      style={{
        backgroundColor: theme.primary_color,
        color: theme.text_color
      }}
      canRemove={true}
      onRemove={props.onRemove}
      style={{
        zIndex: 100,
        minWidth: 625,
        minHeight: 425
      }}
    >
      <PagesContainer>
        <TextComponent>
          <h1>beta updates and caveats!</h1>
          <p>
            below are a number of critical issues and caveats 
          </p>
          
          <ul>
            <li style={{color:'red'}}>
              motion graphs can be added to parameters, 
              but save files will no longer work
            </li>
            <li style={{color:'red'}}>
              copy / paste works for single-input nodes, but fails
              with multi-input nodes. Selecting multiple nodes / subgraphs
              is in the works but currently disabled.
            </li>
            <li style={{color:'green'}}>
              shader library can be added to and deleted from by using
              the toolbar at the top of the screen. The same functionality
              is not currently working when using the library through a 
              context menu.
            </li>
            <li style={{color:'orange'}}>
              undo/redo is not currently functioning and is disabled in the meantime
            </li>
          </ul>
          
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
            Try resizing the individual panels or click the rectangle next to
            the "Help" text above.
          </p>
          <p>
            Your canvas in camogen is set to fullscreen by default, but if you'd
            like to move and resize the canvas individually, click the '*' in
            the upper left hand corner of the screen.
          </p>

          <p>
            Camogen has a number of layouts containing different panels. Explore
            each of these layouts by clicking on 'Layout' in the toolbar on the
            top of the page.
          </p>
        </TextComponent>
        <TextComponent>
          <h2>add motion</h2>
          <p></p>
        </TextComponent>
        <TextComponent>
          <h2>Roadmap</h2>
          <p></p>
        </TextComponent>
      </PagesContainer>
    </PanelComponent>
  );
});

export default Splash;
