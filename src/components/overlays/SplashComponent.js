import React, { useContext, useState } from "react";
import {
  InputSelect,
  InputBool,
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
    window.innerHeight / 2 - 100
  ]);
  const [dimensions, setDimensions] = useState([600, 200]);

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
          onChange={(e) => {
            window.localStorage.setItem('showSplash', e)
            store.setShowSplash(e)
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
        zIndex: 100
      }}
    >
      <div className={styles.title}>
        <TextComponent>
          <h1 style={{ fontSize: "5em", margin: "15px" }}>
            camogen{" "}
            <small>
              <sub>v0.1.0</sub>
            </small>
          </h1>
        </TextComponent>
      </div>  
      <div className={styles.recent}>
        <TextComponent>
          <h1 style={{ fontSize: "5em", margin: "15px" }}>
            camogen{" "}
            <small>
              <sub>v0.1.0</sub>
            </small>
          </h1>
        </TextComponent>
      </div>  
      <div className={styles.credit}>
        <p>created by austin slominski</p>

        <a target="_blank" href="https://twitter.com/aceslowman">
          @aceslowman
        </a>
      </div>
    </PanelComponent>
  );
});

export default Splash;
