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

  const [position, setPosition] = useState([window.innerWidth / 2 - 300, window.innerHeight / 2 - 200]);
  const [dimensions, setDimensions] = useState([600, 400]);
  
  // dimensions: [700, 500],
  // position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250],

  const handlePosition = setPosition;

  const handleDimensions = setDimensions;
  
  console.log(theme)

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
        <h1 2s>
          camogen{" "}
          <small>
            <sub>v0.1.0</sub>
          </small>
        </h1>

        <p>created by austin slominski</p>
        <small>
          <a target="_blank" href="https://twitter.com/aceslowman">
            @aceslowman
          </a>
        </small>
      </TextComponent>
    </PanelComponent>
  );
});

export default Splash;
