import { observer } from "mobx-react";
import React from "react";
import {
  ControlGroupComponent,
  InputFloat,
  InputSelect,
  InputColor
} from "maco-ui";

import styles from './SketchInputComponent.module.css';

const SketchInputComponent = observer(props => {
  const { data } = props.data;
 
  const handleBrushSizeChange = e => data.setBrushSize(e);
  const handleBrushColorChange = e => data.setBrushColor(e);  
  
  

  return (
    <React.Fragment>
      <ControlGroupComponent name="Options">        
        <InputFloat 
          label='size'
          value={data.brushSize} 
          onChange={handleBrushSizeChange}
        />
        <InputColor 
          label='color'
          value={data.brushColor} 
          onChange={handleBrushColorChange}
        />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default SketchInputComponent;
