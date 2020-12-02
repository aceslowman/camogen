import { observer } from "mobx-react";
import React from "react";
import {
  ControlGroupComponent,
  InputFloat,
  InputSelect,
  InputColor
} from "maco-ui";

const TextInputComponent = observer(props => {
  const { data } = props.data;

  const handleTextChange = e => data.setContent(e.target.value);  
  const handleFontFamilyChange = e => data.setFontFamily(e);  
  const handleFontColorChange = e => data.setFontColor(e);  
  const handleFontSizeChange = e => data.setFontSize(e);

  return (
    <React.Fragment>
      <ControlGroupComponent name="Text Content">
        <textarea
          onChange={handleTextChange}
          placeholder={data.content}
        ></textarea>
      </ControlGroupComponent>
      <ControlGroupComponent name="Options">
        <InputSelect
          onChange={handleFontFamilyChange}
          options={[
            { label: "preserve aspect", value: "preserve_aspect" },
            { label: "stretch", value: "stretch" }
          ]}
        />
        <InputFloat 
          value={data.fontSize} 
          onChange={handleFontSizeChange}
        />
        <InputColor 
          value={data.fontColor} 
          onChange={handleFontColorChange}
        />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default TextInputComponent;
