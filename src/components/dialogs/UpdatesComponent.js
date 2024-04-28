import React, { useContext, useState } from "react";
import {
  InputSelect,
  InputBool,
  PanelComponent,
  TextComponent,
  PagesContainer
} from "../../ui";
import * as styles from "./SplashComponent.module.css";
import MainContext from "../../MainContext";
import { observer } from "mobx-react";

const Splash = props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;

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
      canRemove={true}
      onRemove={props.onRemove}
      style={{
        zIndex: 100,
        minWidth: 625,
        minHeight: 425
      }}
    >

        <TextComponent>
          <h1>patch notes</h1>
          <h2>April 28th 2024</h2>
          <ul>
            <li>Completed a major overhaul of camogen, fixing significant bugs, major ui improvements, and removing unreliable features. 
              To play it straight with you, camogen is a large and unwieldy personal project that I have found useful
              and distinct for my own uses. It is much less janky now, but it still has some gaps and quirks that I am going
              to continue slowly working on. Issues that get posted in the itch.io page will get my attention!
            </li>
          </ul>
        </TextComponent>
    </PanelComponent>
  );
};

export default observer(Splash);
