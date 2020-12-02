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
    <ControlGroupComponent name="TextHELLO">
      <textarea
        onChange={handleTextChange}
        placeholder={props.data.data.content}
      ></textarea>
      <InputColor />
    </ControlGroupComponent>
  );
});

export default TextInputComponent;
