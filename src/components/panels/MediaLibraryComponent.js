import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel, TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./MediaLibraryComponent.module.css";
import { ThemeContext } from 'maco-ui';

const MediaLibrary = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const data = store.mediaLibrary;
  const mainRef = useRef();

  const [previewSize, setPreviewSize] = useState(100);
  
  const generatePreviews = () => {
    let tmp = ["","","",""];
    
    return tmp.map((e,i) => (
      <div key={i} style={{border: `1px solid ${theme.outline_color}`}}>
        <div className={style.imageContainer}>
          <img src="https://via.placeholder.com/150x150" />
        </div>

        <p>placeholder.png</p>
      </div>
    ))
  }

  return (
    <GenericPanel panel={props.panel}>
      <div className={style.wrapper}>
        <div className={style.itemPreviewGrid}>
          {generatePreviews()}
        </div>
        <div className={style.itemInfo}>
          <TextComponent>some basic info</TextComponent>
        </div>
      </div>
    </GenericPanel>
  );
});

export default MediaLibrary;
