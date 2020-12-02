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
  const handleFontSizeChange = e => data.setFontSize(e);
  const handleFillColorChange = e => data.setFillColor(e);  

  return (
    <React.Fragment>
      <ControlGroupComponent>
        <textarea
          onChange={handleTextChange}
          placeholder={data.content}
          style={{
            resize: 'vertical'
          }}
        ></textarea>
      </ControlGroupComponent>
      <ControlGroupComponent name="Options">
        <InputSelect
          label="family"
          onChange={handleFontFamilyChange}
          options={[
            { label: "arial", value: "arial" },
            { label: "serif", value: "serif" }
          ]}
        />
        <InputFloat 
          label='size'
          value={data.fontSize} 
          onChange={handleFontSizeChange}
        />
        <InputColor 
          label='fill'
          value={data.fillColor} 
          onChange={handleFillColorChange}
        />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default TextInputComponent;
