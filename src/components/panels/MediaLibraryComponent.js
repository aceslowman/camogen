import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel, TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./MediaLibraryComponent.module.css";
import { ThemeContext, SplitContainer } from "maco-ui";
import Dropzone from "react-dropzone";

const MediaLibrary = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const data = store.mediaLibrary;
  const mainRef = useRef();

  const [previewSize, setPreviewSize] = useState(100);

  const generatePreviews = () => {
    let tmp = ["", "", "", ""];

    return tmp.map((e, i) => (
      <div
        key={i}
        style={{
          border: `1px solid ${theme.outline_color}`,
          backgroundColor: theme.primary_color
        }}
      >
        <div className={style.imageContainer}>
          <img src="https://via.placeholder.com/150x150" />
        </div>

        <div className={style.imageName}>placeholder.png</div>
      </div>
    ));
  };

  return (
    <GenericPanel panel={props.panel}>
      <SplitContainer horizontal className={style.wrapper}>
      <div
          defaultSize={0.7}
          className={style.itemPreviewGrid}
          style={{ backgroundColor: theme.secondary_color }}
        >
          {generatePreviews()}
        </div>
        <div className={style.itemInfo}>
          <TextComponent>some basic info</TextComponent>
        </div>
      </SplitContainer>
    </GenericPanel>
  );
});

export default MediaLibrary;
