import { observer } from "mobx-react";
import React from "react";
import { ControlGroupComponent, InputSelect, InputColor } from "maco-ui";

const TextInputComponent = observer(props => {
  console.log("HIT", props);

  const handleTextChange = e => {
    console.log(e);
    props.data.data.setContent(e.target.value);
  };

  return (
    <React.Fragment>
      <ControlGroupComponent name="Text Content">
        <textarea
          onChange={handleTextChange}
          placeholder={props.data.data.content}
        ></textarea>
      </ControlGroupComponent>
      <ControlGroupComponent name="Text Color">
        <InputColor />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default TextInputComponent;
