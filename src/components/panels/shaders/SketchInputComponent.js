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

const SketchInputComponent = props => {
  const store = useContext(MainContext).store;
  const { data } = props.data;
  const [drawing, setDrawing] = useState(false);

  const handleBrushSizeChange = e => data.setBrushSize(e);
  const handleBrushColorChange = e => data.setBrushColor(e);
    
  let canvas = document.getElementById("canvastest");
  
  const handleMouseDown = useCallback((e) => {
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

      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleMoveEnd);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleMoveEnd);
    }

    // use first touch event if on mobile device
    if (e.touches) e = e.touches[0];

    const p_bounds = canvas.getBoundingClientRect();

    x = e.offsetX;
    y = e.offsetY;

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleMoveEnd);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("touchend", handleMoveEnd);
  }, [props.data.selected(), canvas]);

  useEffect(() => {
    // temp, shouldn't rely on this single ID'd canvas
    let canvas = document.getElementById("canvastest");

    if (props.data.selected()) {
      canvas.addEventListener(
        "mousedown",
        handleMouseDown,
        true
      );
    } else {
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
};

export default observer(SketchInputComponent;
