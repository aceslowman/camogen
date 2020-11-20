import React, { useContext, useState } from "react";
import {
  InputSelect,
  ThemeContext,
  PanelComponent,
  TextComponent
} from "maco-ui";
import styles from "./AboutOverlayComponent.module.css";
import MainContext from "../../MainContext";
import { observer } from "mobx-react";

const AboutOverlay = observer((props) => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [position, setPosition] = useState([50, 50]);
  const [dimensions, setDimensions] = useState([200, 200]);

  const handlePosition = e => {
    setPosition(e);
  };

  const handleDimensions = e => {
    console.log();
    setDimensions(e);
  };

  return (
    <PanelComponent
      position={position}
      dimensions={dimensions}
      onPositionChange={handlePosition}
      onDimensionsChange={handleDimensions}
      className={styles.wrapper}
      floating={true}
      title="about"
      showTitle={true}
      style={{
        backgroundColor: theme.primary_color,
          color: theme.text_color
      }}
      canRemove={true}
      onRemove={props.onRemove}
    >
      <TextComponent>
        <h1>
          camogen <small><sub>v0.1.0</sub></small>
        </h1>

        <p>created by austin slominski</p>
        <small><a target="_blank" href="https://twitter.com/aceslowman">@aceslowman</a></small>
      </TextComponent>
    </PanelComponent>
  );
});

export default AboutOverlay;
