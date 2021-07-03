import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel, TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./MediaLibraryComponent.module.css";
import { ThemeContext, SplitContainer } from "maco-ui";
import Dropzone from "react-dropzone";
import filesize from "file-size";

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
      Array.from(store.mediaLibrary.media.values()).map((media, i) => {
        return (
          <div
            key={media.id}
            onClick={_e => handleClick(_e, media.id)}
            style={{
              border: `1px solid ${
                media.id === selectedFile
                  ? theme.accent_color
                  : theme.outline_color
              }`,
              backgroundColor: theme.primary_color
            }}
          >
            <div className={style.imageContainer}>
              {/* 
                TODO: generate thumbnails?
                
                I'm still unsure what is better, a large <img> or a 
                resized image draw to <canvas>
                                
                placeholder: <img src="https://via.placeholder.com/150x150" />
              */}
              <img
                alt={`thumbnail for asset titled ${media.name}`}
                src={media.dataURL}
              />
            </div>

            <div className={style.imageName}>{media.path}</div>
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
    for (let i = 0; i < e.length; i++) {
      store.mediaLibrary.addMedia(e[i]);
    }
  };

  let selectedMedia = store.mediaLibrary.media.get(selectedFile);

  return (
    <GenericPanel showTitle={false} panel={props.panel}>
      <Dropzone
        onDrop={handleDrop}
        // onDragEnter={() => {}}
        // onDragLeave={() => {}}
      >
        {({ getRootProps, getInputProps }) => (
          <React.Fragment>
            {/* when there is NO media present */}
            {(store.mediaLibrary.media.size === 0) && (
              <div
                {...getRootProps({
                  className: style.noMedia,
                  style: {
                    backgroundColor: theme.secondary_color,
                    border: `1px dotted ${theme.text_color}`
                  }
                })}
              >
                <input {...getInputProps()} />
                no media! drag files here
              </div>
            )}

            {/* when there IS media present */}
            {(store.mediaLibrary.media.size > 0) && (
              <SplitContainer auto className={style.wrapper}>
                <div
                  defaultsize={0.7}
                  {...getRootProps({
                    className: style.itemPreviewGrid,
                    style: {
                      backgroundColor: theme.secondary_color
                    }
                  })}
                >
                  {previews}
                </div>
                <div className={style.itemInfo}>
                  <div className={style.details}>
                    {selectedFile && (
                      <TextComponent>
                        <p>
                          usage:
                          {`${filesize(
                            store.mediaLibrary.getTotalSize()
                          ).human()}`}
                        </p>
                        <p>name: {selectedMedia.name}</p>
                        <p>path: {selectedMedia.path}</p>
                        <p>size: {filesize(selectedMedia.size).human()}</p>
                        <p>type: {selectedMedia.type}</p>
                        <p>dimensions: {selectedMedia.getDimensions()}</p>
                      </TextComponent>
                    )}
                  </div>
                </div>
              </SplitContainer>
            )}
          </React.Fragment>
        )}
      </Dropzone>
    </GenericPanel>
  );
});

export default MediaLibrary;
