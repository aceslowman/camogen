import { observer } from "mobx-react";
import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  useCallback
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
let x,y = 0;

const SketchInputComponent = observer(props => {
  const store = useContext(MainContext).store;
  const { data } = props.data;
  const [drawing, setDrawing] = useState(false);

  const handleBrushSizeChange = e => data.setBrushSize(e);
  const handleBrushColorChange = e => data.setBrushColor(e);
    
  let canvas = document.getElementById("canvastest");
  
  const handleMouseDown = useCallback((e) => {
    console.log("trigger mousedown");
    function handleMove(e) {
      if (e.touches) e = e.touches[0];

      if (e.pageY) {
        data.drawLine(x, y, e.offsetX, e.offsetY);

        x = e.offsetX;
        y = e.offsetY;
      }
    }

    function handleMoveEnd(e) {
      if (e.touches && e.touches[0]) e = e.touches[0];

      if (e.pageY) {
        x = 0;
        y = 0;
      }

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMoveEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleMoveEnd);
    }

    // use first touch event if on mobile device
    if (e.touches) e = e.touches[0];

    const p_bounds = canvas.getBoundingClientRect();

    x = e.offsetX;
    y = e.offsetY;

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMoveEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleMoveEnd);
  }, [props.data.selected(), canvas]);

  useEffect(() => {
    // temp, shouldn't rely on this single ID'd canvas
    let canvas = document.getElementById("canvastest");

    if (props.data.selected()) {
      console.log("adding listener");
      canvas.addEventListener(
        "mousedown",
        handleMouseDown,
        true
      );
    } else {
      console.log("removing listener");
      canvas.removeEventListener(
        "mousedown",
        handleMouseDown,
        true
      );
    }

    return () => canvas.removeEventListener(
      "mousedown",
      handleMouseDown,
      true
    );
  }, [props.data.selected(), handleMouseDown]);

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
