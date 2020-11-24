import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../MainContext";
import useResizeObserver from "../hooks/ResizeHook";
import { GenericPanel, ToolbarComponent, InputSelect } from "maco-ui";
import { observer } from "mobx-react";
import style from "./CanvasDisplayComponent.module.css";

const CanvasDisplay = observer(props => {
  const store = useContext(MainContext).store;
  const [format, setFormat] = useState("PNG");
  const [useKeys, setUseKeys] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const wrapper_ref = useRef(null);

  useResizeObserver(() => {
    if (store.breakoutControlled) return;
    if (!store.p5_instance) return;

    let bounds = wrapper_ref.current.getBoundingClientRect();

    let w = Math.floor(bounds.width);
    let h = Math.floor(bounds.height);

    store.p5_instance.resizeCanvas(w, h);

    setWidth(w);
    setHeight(h);

    // update target dimensions
    for (let target_data of store.scene.targets) {
      target_data.ref.resizeCanvas(w, h);
    }
  }, wrapper_ref);

  const handlePlay = e => store.transport.play();

  const handleStop = e => store.transport.stop();

  const handleRecord = e => store.transport.record();

  const handleSkipToStart = () => store.transport.skipToStart();

  const handleSnap = e => store.snapshot(format);

  const handleFormatSelect = e => setFormat(e);
  
  const handlePresetSelect = (w,h) => {
    // TODO: FIX: +2 and +49 hack
    let _w = Math.floor(w+2);
    let _h = Math.floor(h+49);
    
    setWidth(_w);
    setHeight(_h);
    
    props.panel.setFloating(true);
    props.panel.setFullscreen(false);
    props.panel.setDimensions([_w,_h]);
  }

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
              title: "play",
              label: "▶",
              onClick: handlePlay,
              highlight: store.transport.playing
            },
            {
              title: "stop",
              label: "■",
              onClick: handleStop,
              highlight: !store.transport.playing
            },
            {
              title: "record / snap",
              label: "●",
              onClick: handleSnap,
              style: {
                color: "red"
              }
            },
            {
              label: "rewind",
              onClick: handleSkipToStart,
              highlight: store.transport.playing
            },
            {
              label: `frames: ${store.transport.frameclock}`,
              style: {}
            },
            {
              label: "format " + format,
              dropDown: [
                {
                  label: "png",
                  onClick: () => handleFormatSelect("PNG"),
                  highlight: format === "PNG"
                },
                {
                  label: "jpeg",
                  onClick: () => handleFormatSelect("JPEG"),
                  highlight: format === "JPEG"
                }
              ]
            },
            {
              label: `[${width} x ${height}]`,
              dropDown: [
                {
                  label: "standard",
                  dropDown: [
                    {
                      label: "256x256",
                      onClick: () => handlePresetSelect(256,256)
                    },
                    {
                      label: "512x512",
                      onClick: () => handlePresetSelect(512,512)
                    },
                    {
                      label: "1024x1024",
                      onClick: () => handlePresetSelect(1024,1024)
                    }
                  ]
                },
                {
                  label: "instagram",
                  dropDown: [
                    {
                      label: "landscape 1080x608",
                      onClick: () => handlePresetSelect(1080,608)
                    },
                    {
                      label: "square 1080x1080",
                      onClick: () => handlePresetSelect(1080,1080)
                    },
                    {
                      label: "portrait 1080x1350",
                      onClick: () => handlePresetSelect(1080,1350)
                    }
                  ]
                },
                {
                  label: (
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "row"
                      }}
                    >
                      <label>w:</label>
                      <input
                        style={{
                          pointerEvents: "all",
                          backgroundColor: "inherit",
                          color: "inherit",
                          border: "none",
                          width: "100%",
                          marginLeft: 4,
                          fontFamily: "inherit"
                        }}
                        type="number"
                        placeholder={width}
                        onBlur={e => {
                          let _w = Math.floor(e.target.value);
                          let _h = Math.floor(height);                          
                          setWidth(_w);
                          props.panel.setDimensions([_w+2,_h])// +2 hack
                        }}
                      />
                      <label>h:</label>
                      <input
                        style={{
                          pointerEvents: "all",
                          backgroundColor: "inherit",
                          color: "inherit",
                          border: "none",
                          width: "100%",
                          marginLeft: 4,
                          fontFamily: "inherit"
                        }}
                        type="number"
                        placeholder={height}
                        onBlur={e => {                          
                          let _w = Math.floor(width);
                          let _h = Math.floor(e.target.value);
                          setHeight(_h);
                          props.panel.setDimensions([_w+2,_h]) // +2 hack
                        }}
                      />
                    </div>
                  )
                }
              ],
              style: {
                alignSelf: "flex-end"
              }
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
