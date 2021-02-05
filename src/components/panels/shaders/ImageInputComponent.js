import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef, useContext } from "react";
import Dropzone from "react-dropzone";
import MainContext from "../../../MainContext";

import {
  ControlGroupComponent,
  InputSelect,
  InputFloat,
  TextComponent
} from "maco-ui";
import styles from "./ImageInputComponent.module.css";

const ImageInputComponent = observer(props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;
  const { data } = props.data;
  const canvas_ref = useRef(null);

  const handleDrop = files => {
    data.loadImage(files[0]);
  };

  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param, v) => param.setValue(v);

  useLayoutEffect(() => {
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

    img.src = data.image_url;
  }, [data.image_url]);

  return (
    <React.Fragment>
      <ControlGroupComponent name="Image File">
        <Dropzone onDrop={e => handleDrop(e)}>
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
      </ControlGroupComponent>
      <ControlGroupComponent name="Display Mode">
        <InputSelect
          options={[
            { label: "fit vertical", value: "fit_vertical" },
            { label: "fit horizontal", value: "fit_horizontal" },
            { label: "stretch", value: "stretch" }
          ]}
          onChange={handleDisplayMode}
        />
      </ControlGroupComponent>
      <ControlGroupComponent name="Pan">
        {data.getUniform("pan").elements.map((e, i) => (
          <InputFloat
            key={e.uuid}
            value={e.value}
            onChange={v => handlePan(e, v)}
          />
        ))}
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default ImageInputComponent;
