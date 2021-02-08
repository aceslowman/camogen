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
import MainContext from "../../MainContext";
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
          checked={store.showUpdates}
          onChange={e => {
            window.localStorage.setItem("showUpdates", e);
            store.setShowUpdates(e);
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
          <h1>alpha updates and caveats!</h1>
          <p>below are a number of critical issues and caveats</p>

          <ul>            
            <li style={{ color: "red" }}>
              Copy / paste is in progress but is temporarily disabled.
            </li>
            <li style={{ color: "red" }}>
              Shader library can be added to and deleted from by using the
              toolbar at the top of the screen. The same functionality is not
              currently working when using the library through a context menu.
            </li>
            <li style={{ color: "red" }}>
              Undo/redo is in progress but is temporarily disabled.
            </li>
          </ul>

          <p>
            I'll be adding to this list often, and at the moment, camogen will
            be updated often and there will be a chance that save files and / or
            shader collections could be overwritten. You can backup your
            collection by going to Library {"->"} Save Collection.
          </p>

          <p>
            if/when you run into issues, please let me know by creating an issue
            at{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.accent_color }}
              href="https://github.com/aceslowman/camogen/issues"
            >
              https://github.com/aceslowman/camogen/issues
            </a>
          </p>
        </TextComponent>
        <TextComponent>
          <h1>changelog</h1>
          <h2>v1.0.1-alpha</h2>
          <ul>
            <li>Added 'Float' node to operator graphs.</li>
            <li>Fixed issues with operator controls and refactored.</li>
          </ul>
          <h2>v1.0.2-alpha</h2>
          <ul>
            <li>Restored keybindings to operator graphs.</li>
            <li>Cleaned up some styling around operator graphs.</li>
          </ul>
          <h2>v1.0.3-alpha</h2>
          <ul>
            <li>Fixed deserialization issues with motion graphs.</li>
            <li>Fixed and refactored operator controls.</li>
          </ul>
          <h2>v1.1.3-alpha</h2>
          <ul>
            <li>Added video node</li>
            <li>Added 'missing assets' dialog when loading a project.</li>
            <li>Improved image node dropzone.</li>
          </ul>
          
        </TextComponent>
      </PagesContainer>
    </PanelComponent>
  );
});

export default Splash;
