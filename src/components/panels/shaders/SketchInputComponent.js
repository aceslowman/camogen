import { observer } from "mobx-react";
import React, { useRef, useEffect, useLayoutEffect, useState, useContext } from "react";
import {
  ControlGroupComponent,
  InputFloat,
  InputSelect,
  InputColor
} from "maco-ui";
import MainContext from "../../../MainContext";
import styles from './SketchInputComponent.module.css';
import { getSnapshot } from "mobx-state-tree";

const SketchInputComponent = observer(props => {
  const store = useContext(MainContext).store;
  const { data } = props.data;
 
  const handleBrushSizeChange = e => data.setBrushSize(e);
  const handleBrushColorChange = e => data.setBrushColor(e);  
  
  useEffect(() => {
    // add event listener for mouse on canvas
    console.log(store.getCanvas())
    // return 
  }, [])

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
