import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef, useContext, useState } from "react";
import Dropzone from "react-dropzone";
import MainContext from "../../../MainContext";
import {
  ControlGroupComponent,
  InputSelect,
  InputFloat,
  TextComponent
} from "maco-ui";
import styles from "./MediaSelectorComponent.module.css";

const MediaSelectorComponent = observer(props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;
  const canvas_ref = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState();

  const handleDrop = files => {
    setSelectedMedia(store.mediaLibrary.addMedia(files[0]));
    props.onMediaSelect(files[0]);
  };

  useLayoutEffect(() => {
    if (!selectedMedia) return;
    /*
      I do not know whether or not this is efficient!
      I am grabbing the whole image each time and generating
      a smaller thumbnail.
      
      TODO: should limit width at some point, becomes too large
      when the control panel is made wider
    */
    const ctx = canvas_ref.current.getContext("2d");

    let img = new Image();

    img.onload = function() {
      let aspect = this.naturalWidth / this.naturalHeight;
      let w = 0;
      let h = 0;

      w = canvas_ref.current.width;
      h = canvas_ref.current.width / aspect;
      canvas_ref.current.height = h;

      ctx.drawImage(this, 0, 0, w, h);
    };

    img.src = store.mediaLibrary.media.get(selectedMedia).dataURL;
  }, [selectedMedia]);

  const handleMediaSelect = value => {
    setSelectedMedia(value);
    props.onMediaSelect(value);
  };

  return (
    <React.Fragment>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section
            className={styles.dropzone}
            style={{ border: `1px dotted ${theme.text_color}` }}
          >
            <div>
              <canvas ref={canvas_ref} className={styles.canvas} />
            </div>
            <div
              {...{
                ...getRootProps(),
                className: styles.dropzoneOverlay,
                style: {
                  backgroundColor: theme.primary_color,
                  color: theme.text_color
                }
              }}
            >
              <input {...getInputProps()} />
              <TextComponent>
                <p>click or drop an image</p>
              </TextComponent>
            </div>
          </section>
        )}
      </Dropzone>
      <InputSelect
        className={styles.select}
        options={Array.from(store.mediaLibrary.media.values()).map(e => ({
          label: e.name,
          value: e.id
        }))}
        onChange={handleMediaSelect}
        selectedOption={selectedMedia}
      />
    </React.Fragment>
  );
});

export default MediaSelectorComponent;
