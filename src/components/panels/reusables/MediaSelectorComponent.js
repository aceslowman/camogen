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
import { getSnapshot, isAlive } from "mobx-state-tree";

const MediaSelectorComponent = props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;
  const canvas_ref = useRef(null);
  // const [selectedMedia, setSelectedMedia] = useState();
  
  console.log('selectedMedia',props.selectedMedia)

  const handleDrop = files => {
    let new_media_id = store.mediaLibrary.addMedia(files[0]); 
    // setSelectedMedia(new_media_id);    
    props.onMediaSelect(new_media_id);
  };
  
  const handleMediaSelect = value => {
    // console.log('handling media select', value)
    // setSelectedMedia(value);
    props.onMediaSelect(value);
  };

  useLayoutEffect(() => {
    if (!props.selectedMedia) return;
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

    console.log('getting media', props.selectedMedia)
    img.src = props.selectedMedia.dataURL;
    // img.src = store.mediaLibrary.media.get(props.selectedMedia).dataURL;
  }, [props.selectedMedia]);

  return (
    <div className={styles.wrapper}>
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
                className: props.selectedMedia ? styles.dropzoneOverlay : styles.noMediaOverlay,
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
        selectedOption={props.selectedMedia}
      />
    </div>
  );
};

export default observer(MediaSelectorComponent);
