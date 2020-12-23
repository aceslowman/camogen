import { observer } from "mobx-react";
import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useContext
} from "react";
import {
  ControlGroupComponent,
  InputFloat,
  InputSelect,
  InputColor
} from "maco-ui";
import MainContext from "../../../MainContext";
import styles from "./SketchInputComponent.module.css";
import { getSnapshot } from "mobx-state-tree";
let isDrawing = false;
const SketchInputComponent = observer(props => {
  const store = useContext(MainContext).store;
  const { data } = props.data;
  const [drawing, setDrawing] = useState(false);

  const handleBrushSizeChange = e => data.setBrushSize(e);
  const handleBrushColorChange = e => data.setBrushColor(e);

  const handleMouseDown = (e, wrapper_element) => {
    /*
			there are issues with drag events in firefox that make
			the native 'drag' events less useful for this case. my 
			alternative was to use mouseEvents and create listeners 
			on the document
		*/

    function handleMove(e) {
      if (e.touches) e = e.touches[0];

      if (e.pageY) {
        const x = e.pageX - dragOff[0];
        const y = e.pageY - dragOff[1];
        
        console.log('moving')

        // limits to upper left
        // props.onPositionChange([x >= 0 ? x : 0, y >= 0 ? y : 0]);
      }
    }

    function handleMoveEnd(e) {
      if (e.touches && e.touches[0]) e = e.touches[0];

      if (e.pageY) {
        const x = e.pageX - dragOff[0];
        const y = e.pageY - dragOff[1];

        console.log('end')
        // limits to upper left
        // props.onPositionChange([x >= 0 ? x : 0, y >= 0 ? y : 0]);
      }

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMoveEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleMoveEnd);
    }

    // use first touch event if on mobile device
    if (e.touches) e = e.touches[0];

    const p_bounds = wrapper_element.getBoundingClientRect();
    let offset = { x: p_bounds.left, y: p_bounds.top };

    let dragOff = [e.pageX - offset.x, e.pageY - offset.y];

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMoveEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleMoveEnd);
  };

  useEffect(() => {
    // temp, shouldn't rely on this single ID'd canvas
    let canvas = document.getElementById("canvastest");

    // add event listeners for mouse on canvas
    canvas.addEventListener("mousedown", e => handleMouseDown(e, canvas));
    // canvas.addEventListener("mousemove", e => handleMouseMove(e));
    // canvas.addEventListener("mouseup", e => handleMouseUp(e));

    return () => {
      canvas.removeEventListener("mousedown", e => handleMouseDown(e, canvas));
      // canvas.removeEventListener("mousemove", e => handleMouseMove(e));
      // canvas.removeEventListener("mouseup", e => handleMouseUp(e));
    };
  }, []);

  return (
    <React.Fragment>
      <ControlGroupComponent name="Options">
        <InputFloat
          label="size"
          value={data.brushSize}
          onChange={handleBrushSizeChange}
        />
        <InputColor
          label="color"
          value={data.brushColor}
          onChange={handleBrushColorChange}
        />
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default SketchInputComponent;
