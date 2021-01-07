import React, { useContext, useState } from "react";
import {
  InputSelect,
  ThemeContext,
  PanelComponent,
  TextComponent
} from "maco-ui";
import styles from "./SplashComponent.module.css";
import MainContext from "../../MainContext";
import { observer } from "mobx-react";

const Splash = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [position, setPosition] = useState([
    window.innerWidth / 2 - 300,
    window.innerHeight / 2 - 125
  ]);
  const [dimensions, setDimensions] = useState([600, 250]);

  // dimensions: [700, 500],
  // position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250],

  const handlePosition = setPosition;

  const handleDimensions = setDimensions;

  console.log(theme);

  return (
    <PanelComponent
      position={position}
      dimensions={dimensions}
      onPositionChange={handlePosition}
      onDimensionsChange={handleDimensions}
      className={styles.wrapper}
      floating={true}
      //title="about"
      showTitle={true}
      style={{
        backgroundColor: theme.primary_color,
        color: theme.text_color
      }}
      canRemove={true}
      onRemove={props.onRemove}
      style={{
        zIndex: 100
      }}
    >
      <TextComponent>
        <h1 style={{ fontSize: "5em", margin: "15px" }}>
          camogen{" "}
          <small>
            <sub>v0.1.0</sub>
          </small>
        </h1>
      </TextComponent>
      <div className={styles.credit}>
        <p>created by austin slominski</p>
        <div
          style={{
            backgroundColor: theme.text_color,
            color: theme.primary_color
          }}
        >
          <small>
            <a target="_blank" href="https://twitter.com/aceslowman">
              @aceslowman
            </a>
          </small>
        </div>
      </div>
    </PanelComponent>
  );
});

export default Splash;
