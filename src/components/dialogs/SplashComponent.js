import React, { useContext, useState } from "react";
import {
  InputSelect,
  InputBool,
  PanelComponent,
  TextComponent
} from "maco-ui";
import styles from "./SplashComponent.module.css";
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
            <small>{store.version}</small>

            <p style={{ color: "red", fontSize: "0.5em" }}>
              Note: for the time being, camogen works best in Chrome
            </p>
          </div>
          {window.localStorage.getItem("recent_save") && (
            <div className={styles.recent}>
              <button onClick={() => store.loadRecentSave()}>
                load most recent save
              </button>
            </div>
          )}
        </div>

        <div className={styles.credit}>
          <p>
            created by austin slominski (<em>@aceslowman</em>)
          </p>

          <a
            style={{ color: theme.accent_color }}
            target="_blank"
            href="https://twitter.com/aceslowman"
          >
            twitter
          </a>
          <a
            style={{ color: theme.accent_color }}
            target="_blank"
            href="https://instagram.com/aceslowman"
          >
            insta
          </a>
          <a
            style={{ color: theme.accent_color }}
            target="_blank"
            href="https://github.com/aceslowman"
          >
            github
          </a>
        </div>
      </div>
    </PanelComponent>
  );
};

export default observer(Splash);
