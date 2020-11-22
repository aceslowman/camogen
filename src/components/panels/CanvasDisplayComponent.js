import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../MainContext";
import useResizeObserver from "../hooks/ResizeHook";
import { GenericPanel, ToolbarComponent, InputSelect } from "maco-ui";
import { observer } from "mobx-react";
import style from "./CanvasDisplayComponent.module.css";

const CanvasDisplay = observer(props => {
  const store = useContext(MainContext).store;
  const [format, setFormat] = useState('PNG');
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

  const handlePlay = e => {
    console.log("Play");
    store.transport.play();
  };

  const handleStop = e => {
    console.log("Stop");
    store.transport.stop();
  };

  const handleRecord = e => {
    console.log("Record");
    store.transport.record();
  };

  const handleSkipToStart = () => {
    store.transport.skipToStart();
  };

  const handleSnap = e => {
    console.log("Snap");
    store.snapshot(format);
  };

  const handleFormatSelect = e => {
    console.log("FormatSelect", e);
    setFormat(e);
  };

  return (
    <GenericPanel
      panel={props.panel}
      showTitle={!props.panel.fullscreen}
      floating={false}
      footbar={
        <ToolbarComponent
          style={{
            zIndex: 0
          }}
          items={[
            {
              label: "▶",
              onClick: handlePlay,
              highlight: store.transport.playing
            },
            {
              label: "■",
              onClick: handleStop,
              highlight: !store.transport.playing
            },
            {
              label: "●",
              onClick: handleSnap
            },
            {
              label: "to start",
              onClick: handleSkipToStart,
              highlight: store.transport.playing
            },
            {
              label: `frames: ${store.transport.frameclock}`
            },
            {
              label: (
                <InputSelect
                  //label="format"
                  options={[
                    { label: ".png", value: "PNG" },
                    { label: ".jpeg", value: "JPEG" }
                  ]}
                  onChange={() => {}}
                />
              ),
              highlight: false
            }
          ]}
        />
      }
      style={{
        zIndex: 0
      }}
    >
      <div ref={wrapper_ref} id="canvastest" className={style.canvastest}></div>
    </GenericPanel>
  );
});

export default CanvasDisplay;
