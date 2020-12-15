import { observer } from "mobx-react";
import React from "react";
import { ControlGroupComponent, InputSelect } from "maco-ui";

const ImageInputComponent = observer(props => {
  const { data } = props.data;

  const handleFileSubmit = e => data.loadImage(e);
  const handleDisplayModeChange = e => data.setDisplayMode(e);

  return (
    <React.Fragment>
      <ControlGroupComponent name="Image File">
        <input type="file" onChange={handleFileSubmit} />
      </ControlGroupComponent>
      <ControlGroupComponent name="Display Mode">
        <InputSelect
          options={[
            { label: "preserve aspect", value: "preserve_aspect" },
            { label: "stretch", value: "stretch" }
          ]}
          onChange={handleDisplayModeChange}
        />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default ImageInputComponent;
