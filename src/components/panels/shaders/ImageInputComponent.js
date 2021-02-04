import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef } from "react";
import Dropzone from "react-dropzone";

import {
  ControlGroupComponent,
  InputSelect,
  InputFloat,
  TextComponent
} from "maco-ui";
import styles from "./ImageInputComponent.module.css";

const ImageInputComponent = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const { data } = props.data;
  const canvas_ref = useRef(null);

  const handleFileSubmit = e => {};

  const handleFileDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    data.loadImage(e.dataTransfer.files[0]);
  };

  const handleDrop = files => {
    data.loadImage(files[0]);
    //     files.forEach((file, i) => {
    //       console.log('FILE', file)
    //       // let file = e.target.files[0];

    //       data.loadImage(file);
    // //       store.missingAssets.forEach(asset => {
    // //         if (file.name === asset.user_filename) {
    // //           if (matches.indexOf(asset.user_filename) < 0)
    // //             setMatches(prevMatches => [...prevMatches, asset.user_filename]);

    // //           var reader = new FileReader();

    // //           reader.onload = e => {
    // //             var image = document.createElement("img");
    // //             asset.setImage(e.target.result);
    // //             asset.setUserFilename(file.name);
    // //           };

    // //           reader.readAsDataURL(file);
    // //         }
    // //       });
    //     });
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
              style={{border: `1px dotted ${theme.outline_color}`}}
            >
              <div
                {...getRootProps({
                  style: {
                    height: "100%",
                    // padding: "15px 0px",
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                  }
                })}
              >
                <input {...getInputProps()} />
                <canvas
                  ref={canvas_ref}
                  className={styles.canvas}
                  //onDrop={handleFileDrop}
                />
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
