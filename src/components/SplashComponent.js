import React, { useContext, useState } from "react";
import {
  InputSelect,
  InputBool,
  ThemeContext,
  PanelComponent,
  TextComponent
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
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            <h1>camogen </h1>
            <small>v1.0.2-alpha</small>
            
            <p>
              <a style={{color:theme.accent_color, fontSize: '0.5em'}} target="_blank" href="https://discord.gg/TAxb2Kg">
                join the discord!
              </a>
            </p>
            
            <p style={{color:'red', fontSize: '0.5em'}}>
                Note: for the time being, camogen works best in Chrome!
            </p>  
          </div>
          {/*<div className={styles.recent}>
            <TextComponent>
              <h2>Recent projects</h2>
            </TextComponent>
          </div>*/}
        </div>

        <div className={styles.credit}>
          <p>created by austin slominski (<em>@aceslowman</em>)</p>

          <a style={{color:theme.accent_color}} target="_blank" href="https://twitter.com/aceslowman">
            twitter
          </a>
          <a style={{color:theme.accent_color}} target="_blank" href="https://instagram.com/aceslowman">
            insta
          </a>
          <a style={{color:theme.accent_color}} target="_blank" href="https://github.com/aceslowman">
            github
          </a>
        </div>
      </div>
    </PanelComponent>
  );
});

export default Splash;
