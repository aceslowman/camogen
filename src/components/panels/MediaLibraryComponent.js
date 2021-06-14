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

  const [previewSize, setPreviewSize] = useState(100);

  return (
    <GenericPanel panel={props.panel}>
      <div className={style.wrapper}>
        <div className={style.itemPreviewGrid}>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/250x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x250" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/350x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x350" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/250x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x250" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/350x150" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x350" />
            </div>

            <p>placeholder.png</p>
          </div>
          <div>
            <div className={style.imageContainer}>
              <img src="https://via.placeholder.com/150x150" />
            </div>

            <p>placeholder.png</p>
          </div>
        </div>
        <div className={style.itemInfo}>
          <TextComponent>some basic info</TextComponent>
        </div>
      </div>
    </GenericPanel>
  );
});

export default MediaLibrary;
