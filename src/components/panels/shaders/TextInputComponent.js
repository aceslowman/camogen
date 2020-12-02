import { observer } from "mobx-react";
import React from "react";
import {
  ControlGroupComponent,
  InputFloat,
  InputSelect,
  InputColor
} from "maco-ui";

const TextInputComponent = observer(props => {
  console.log("HIT", props);
  const { data } = props.data;

  const handleTextChange = e => {
    data.setContent(e.target.value);
  };
  
  const handleFontColorChange = e => {
    console.log('e',e)
    data.setFontColor(e);
  }
  
  const handleFontSizeChange = e => {
    data.setFontSize(e);
  }
  
  const handleFontFamilyChange = e => {
    data.setFontFamily(e);
  }

  return (
    <React.Fragment>
      <ControlGroupComponent name="Text Content">
        <textarea
          onChange={handleTextChange}
          placeholder={data.content}
        ></textarea>
      </ControlGroupComponent>
      <ControlGroupComponent name="Text Color">
        <InputSelect
          options={[
            { label: "preserve aspect", value: "preserve_aspect" },
            { label: "stretch", value: "stretch" }
          ]}
          onChange={handleFontFamilyChange}
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
