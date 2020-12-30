import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef } from "react";
import { ControlGroupComponent, InputSelect, InputFloat } from "maco-ui";
import styles from "./ImageInputComponent.module.css";

const ImageInputComponent = observer(props => {
  const { data } = props.data;
  const canvas_ref = useRef(null);

  const handleFileSubmit = e => {
    data.loadImage(e);
  }
  
  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param, v) => param.setValue(v);
  
  useLayoutEffect(() => {
    console.log('file changed', data.img)
    const ctx = canvas_ref.current.getContext("2d");
    ctx.drawImage(data.img.canvas, 0, 0)
    canvas_ref.current.width = 80;
    canvas_ref.current.height = 80;
  }, [data.img]);

  return (
    <React.Fragment>
      <canvas ref={canvas_ref} className={styles.canvas} />
      <ControlGroupComponent name="Image File">
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

export default ImageInputComponent;
