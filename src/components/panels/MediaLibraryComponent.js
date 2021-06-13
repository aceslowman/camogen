import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel, TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./MediaLibraryComponent.module.css";

const MediaLibrary = observer(props => {
  const store = useContext(MainContext).store;
  const data = store.mediaLibrary;
  const mainRef = useRef();

  return (
    <GenericPanel
      panel={props.panel}    
    >
      <div className={style.wrapper}>
        <div className={style.itemPreviewGrid}>
          <div>
            <img src="https://via.placeholder.com/150/150"/>
            <p>placeholder.png</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/250/150"/>
            <p>placeholder.png</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/150/250"/>
            <p>placeholder.png</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/350/150"/>
            <p>placeholder.png</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/150/350"/>
            <p>placeholder.png</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/150/150"/>
            <p>placeholder.png</p>
          </div>
        </div>
        <div className={style.itemInfo}>
          <TextComponent>
            some basic info
          </TextComponent>          
        </div>
      </div>      
    </GenericPanel>
  );
});

export default MediaLibrary;
