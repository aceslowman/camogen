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

  useResizeObserver(() => {
    if (store.breakoutControlled) return;
    if (!store.p5_instance) return;

    let bounds = wrapper_ref.current.getBoundingClientRect();

    store.p5_instance.resizeCanvas(bounds.width, bounds.height);

    // update target dimensions
    for (let target_data of store.scene.targets) {
      target_data.ref.resizeCanvas(bounds.width, bounds.height);
    }
  }, wrapper_ref);

  /*toolbar={transportTools}*/
  console.log(props.panel);
  return (
    <GenericPanel
      panel={props.panel}
      showTitle={true}
      // showTitle={false}
      floating={false}
      footbar={
        <ToolbarComponent
          style={{
            zIndex: 0
          }}
          items={[
            {
              label: "▶",
              onClick: () => {
                // handlePlay
              }
              highlight: store.transport.playing
            },
            {
              label: "■",
              onClick: () => {
                // handlePlay
              }
              highlight: store.transport.playing
            },
            {
              label: "⭰",
              onClick: () => {
                // handlePlay
              }
              highlight: store.transport.playing
            },
            {
              label: "▶",
              onClick: () => {
                // handlePlay
              }
              highlight: store.transport.playing
            },
            
                <button 
                    title="stop" 
                    onClick={handleStop}
                    style={{
                        color: !store.transport.playing ? theme.accent_color : theme.text_color
                    }}
                > ■ </button>
                <button 
                    title="to start" 
                    onClick={handleSkipToStart}
                > ⭰ </button>
                {/* <button onClick={handleSkipToStart}> ⭲ </button> */}
                <button 
                    title="record" 
                    onClick={handleRecord}
                    style={{
                        color: store.transport.recording ? 'red' : theme.text_color
                    }}
                > ● </button>
                <button 
                    title="snapshot" 
                    onClick={handleSnap}
                > snap </button>
          ]}
        />
      }
      style={{
        zIndex: 0
      }}
    >
        <div
          ref={wrapper_ref}
          id="canvastest"
          className={style.canvastest}
        ></div>
    </GenericPanel>
  );
});

export default CanvasDisplay;
