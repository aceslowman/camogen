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
  const [previews, setPreviews] = useState();

  const [selectedFile, setSelectedFile] = useState();

  const [previewSize, setPreviewSize] = useState(100);

  const generatePreviews = useEffect(() => {
    const handleClick = (e, id) => {    
      setSelectedFile(id);
    };

    setPreviews(
      Array.from(store.mediaLibrary.media.values()).map((e, i) => {
        console.log("e", getSnapshot(e));
        return (
          <div
            key={e.id}
            onClick={_e => handleClick(_e, e.id)}
            style={{
              border: `1px solid ${
                e.id === selectedFile ? theme.accent_color : theme.outline_color
              }`,
              backgroundColor: theme.primary_color
            }}
          >
            <div className={style.imageContainer}>
              {/* TODO: should generate thumbnails */}
              <img src="https://via.placeholder.com/150x150" />
            </div>

            <div className={style.imageName}>{e.path}</div>
          </div>
        );
      })
    );
  }, [
    store.mediaLibrary,
    store.mediaLibrary.media.size,
    selectedFile,
    setSelectedFile,
    setPreviews
  ]);

  const handleDrop = e => {
    console.log(e)
    store.mediaLibrary.addMedia(e);
  };

  return (
    <GenericPanel panel={props.panel}>
      <SplitContainer horizontal className={style.wrapper}>
        <Dropzone defaultSize={0.7} onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({
                className: style.itemPreviewGrid,
                style: {
                  backgroundColor: theme.secondary_color
                  // border: `1px dotted ${theme.text_color}`
                }
              })}
            >
              {/*<input {...getInputProps()} />*/}
              {previews}
            </div>
          )}
        </Dropzone>

        <div className={style.itemInfo}>
          {selectedFile && (
            <TextComponent>
              path: {store.mediaLibrary.media.get(selectedFile).path}
            </TextComponent>
          )}
        </div>
      </SplitContainer>
    </GenericPanel>
  );
});

export default MediaLibrary;
