import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef } from "react";
import { ControlGroupComponent, InputSelect, InputFloat } from "maco-ui";
import styles from "./VideoInputComponent.module.css";

const VideoInputComponent = observer(props => {
  const { data } = props.data;
  const canvas_ref = useRef(null);

  const handleFileSubmit = e => {
    let file = e.target.files[0];
    
    data.loadImage(file);
  };
  
  const handleFileDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    data.loadImage(e.dataTransfer.files[0]);
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
      <canvas 
        ref={canvas_ref} 
        className={styles.canvas}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('onDragEnter')
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('onDragOver')
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('onDragLeave')
        }}
        onDrop={handleFileDrop}
      />
      <ControlGroupComponent name="Image File">
        <div>
          <div
            className={styles.drop}
            style={{
              border: "1px dotted white",
              color: "white"
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('onDragEnter')
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('onDragOver')
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('onDragLeave')
            }}
            onDrop={handleFileDrop}
          >
            drop file
          </div>
        </div>

        <input type="file" onChange={handleFileSubmit} />
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

export default VideoInputComponent;
