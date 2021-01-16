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
        <TextComponent>
          <h1>beta updates and caveats!</h1>
          <p>
            below are a number of critical issues and caveats 
          </p>
          
          <ul>
            <li style={{color:'red'}}>
              Motion graphs can be added to parameters, 
              but save files will no longer work.
            </li>
            <li style={{color:'red'}}>
              It is safe to add a counter through the motion graph, but other 
              nodes have issues. I'll be focusing on motion after fixing issues
              with serialization.
            </li>
            <li style={{color:'red'}}>
              Copy / paste works for single-input nodes, but fails
              with multi-input nodes. Selecting multiple nodes / subgraphs
              is in the works but currently disabled.
            </li>
            <li style={{color:'red'}}>
              Shader library can be added to and deleted from by using
              the toolbar at the top of the screen. The same functionality
              is not currently working when using the library through a 
              context menu.
            </li>
            <li style={{color:'red'}}>
              Undo/redo is not currently functioning and is disabled in the meantime
            </li>            
          </ul>
          
          <p>
            I'll be adding to this list often, and at the moment, camogen will be updated often and there will be a chance that save files and / or shader collections could be overwritten. You can backup your collection by going to Library {'->'} Save Collection.
          </p>
          
          <p>
            if/when you run into issues, please let me know by creating an issue at <a target="_blank" rel="noopener noreferrer" style={{color:theme.accent_color}} href="https://github.com/aceslowman/camogen/issues">https://github.com/aceslowman/camogen/issues</a>
          </p>
          
        </TextComponent>

    </PanelComponent>
  );
});

export default Splash;
