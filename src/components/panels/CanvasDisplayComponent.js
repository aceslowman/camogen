import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../MainContext";
import useResizeObserver from "../hooks/ResizeHook";
import { GenericPanel, ToolbarComponent } from "maco-ui";
import { observer } from "mobx-react";
import style from "./CanvasDisplayComponent.module.css";

const CanvasDisplay = observer(props => {
  const store = useContext(MainContext).store;
  const [useKeys, setUseKeys] = useState(false);
  const wrapper_ref = useRef(null);

//   useResizeObserver(() => {
//     // const ctx = canvas_ref.current.getContext('2d');
//     // const wrapper_bounds = wrapper_ref.current.getBoundingClientRect();
//     // let _labels = [];
//     if (store.breakoutControlled) return;
//     if (!store.p5_instance) return;

//     let bounds = wrapper_ref.current.getBoundingClientRect();

//     store.p5_instance.resizeCanvas(bounds.width, bounds.height);

//     // update target dimensions
//     for (let target_data of store.scene.targets) {
//       target_data.ref.resizeCanvas(bounds.width, bounds.height);
//     }
//   }, wrapper_ref);
  
  const transportTools = (
    <ToolbarComponent
      items={[
        {
          label: "play",
          onClick: () => {
            // setShowAbout(!showAbout);
          },
          // highlight: showAbout
        }
      ]}
    />
  )

  /*toolbar={transportTools}*/
  console.log(props.panel)
  return (
    <GenericPanel
      panel={props.panel}
      // showTitle={false}
      floating={false}
      style={{
        // zIndex: -1
        boxSizing: 'border-box'
      }}
    >
      <div className={style.wrapper}>
        {/*<div id="canvastest" ref={wrapper_ref} className={style.canvastest}></div>*/}
      </div>
      
      {transportTools}
    </GenericPanel>
  );
});

export default CanvasDisplay;
