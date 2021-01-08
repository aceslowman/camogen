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
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            <h1>camogen </h1>
            <small>v0.1.0</small>
          </div>
          <div className={styles.recent}>
            <TextComponent>all kinds of stuff</TextComponent>
          </div>
        </div>

        <div className={styles.credit}>
          <p>created by austin slominski</p>

          <a target="_blank" href="https://twitter.com/aceslowman">
            @aceslowman
          </a>
        </div>
      </div>
    </PanelComponent>
  );
});

export default Splash;
