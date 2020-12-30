import { observer } from "mobx-react";
import React from "react";
import { ControlGroupComponent, InputSelect, InputFloat } from "maco-ui";

const ImageInputComponent = observer(props => {
  const { data } = props.data;

  const handleFileSubmit = e => {
    data.loadImage(e);
  }
  
  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param, v) => param.setValue(v);
  
  useLayoutAffect

  return (
    <React.Fragment>
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
