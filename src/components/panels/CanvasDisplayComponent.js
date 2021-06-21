import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
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
  const [zoom, setZoom] = useState(50);
  const wrapper_ref = useRef(null);
  const panel_ref = useRef(null);

  useResizeObserver(() => {
    if (store.breakoutControlled) return;
    if (!store.p5_instance) return;

    let inner_bounds = wrapper_ref.current.getBoundingClientRect();
    let panel_bounds = panel_ref.current.parentElement.getBoundingClientRect();

    let offset_x = panel_bounds.width - inner_bounds.width;
    let offset_y = panel_bounds.height - inner_bounds.height;

    let w = Math.round(inner_bounds.width);
    let h = Math.round(inner_bounds.height);

    store.resizeCanvas(w, h);

    setWidth(w);
    setHeight(h);
  }, wrapper_ref);

  const handleDimensionChange = (w, h) => {
    setWidth(w);
    setHeight(h);

    // make sure panel is detached so it can change size
    props.panel.setFloating(true);
    props.panel.setFullscreen(false);
  };

  const handleZoomChange = amount => {
    console.log("amount", amount);
    setZoom(amount);
  };

  const handlePlay = e => store.transport.play();

  const handleStop = e => store.transport.stop();

  const handleRecord = e => store.transport.record();

  const handleSkipToStart = () => store.transport.skipToStart();

  const handleSnap = e => store.transport.snapshot(format);

  const handleFormatSelect = e => setFormat(e);

  useLayoutEffect(() => {
    let inner_bounds = wrapper_ref.current.getBoundingClientRect();
    let panel_bounds = panel_ref.current.parentElement.getBoundingClientRect();

    // offset needed to take account of toolbar and footbar
    let offset_x = panel_bounds.width - inner_bounds.width;
    let offset_y = panel_bounds.height - inner_bounds.height;

    let _w = width + offset_x;
    let _h = height + offset_y;

    props.panel.setDimensions([_w, _h]);
  }, [width, height]);

  return (
    <GenericPanel
      panel={props.panel}
      showTitle={!props.panel.fullscreen}
      floating={false}
      onRef={panel_ref}
      onContextMenu={() => store.ui.context.setContextmenu()}
      footbar={
        <ToolbarComponent
          style={{
            zIndex: 0
          }}
          items={{
            play: {
              id: "play",
              title: "play",
              label: "▶",
              onClick: handlePlay,
              highlight: store.transport.playing
            },
            stop: {
              id: "stop",
              title: "stop",
              label: "■",
              onClick: handleStop,
              highlight: !store.transport.playing
            },
            record: {
              id: "record",
              title: "record",
              label: "●",
              // label: store.transport.recording
              // // ? `● ${Date.now() - store.transport.recordStart}`
              // : "●",
              onClick: handleRecord,
              highlight: store.transport.recording,
              style: {
                color: store.transport.recording
                  ? "red"
                  : store.ui.theme.text_color
              }
            },
            snap: {
              id: "snap",
              title: "snap",
              label: "snap",
              onClick: handleSnap
            },
            rewind: {
              id: "rewind",
              label: "rewind",
              onClick: handleSkipToStart,
              highlight: store.transport.playing
            },
            Frameclock: {
              id: "Frameclock",
              label: `frames: ${store.transport.frameclock}`,
              style: {}
            },
            format: {
              id: "format",
              label: "format " + format,
              dropDown: {
                png: {
                  id: "png",
                  label: "png",
                  onClick: () => handleFormatSelect("PNG"),
                  highlight: format === "PNG"
                },
                jpeg: {
                  id: "jpeg",
                  label: "jpeg",
                  onClick: () => handleFormatSelect("JPEG"),
                  highlight: format === "JPEG"
                }
              }
            },
            Dimensions: {
              id: "Dimensions",
              label: `[${width} x ${height}]`,
              dropDown: {
                standard: {
                  id: "standard",
                  label: "standard",
                  dropDown: {
                    "256x256": {
                      id: "256x256",
                      label: "256x256",
                      onClick: () => handleDimensionChange(256, 256)
                    },
                    "512x512": {
                      id: "512x512",
                      label: "512x512",
                      onClick: () => handleDimensionChange(512, 512)
                    },
                    "1024x1024": {
                      id: "1024x1024",
                      label: "1024x1024",
                      onClick: () => handleDimensionChange(1024, 1024)
                    }
                  }
                },
                instagram: {
                  id: "instagram",
                  label: "instagram",
                  dropDown: {
                    landscape1080x608: {
                      id: "landscape1080x608",
                      label: "landscape 1080x608",
                      onClick: () => handleDimensionChange(1080, 608)
                    },
                    square1080x1080: {
                      id: "square1080x1080",
                      label: "square 1080x1080",
                      onClick: () => handleDimensionChange(1080, 1080)
                    },
                    portrait1080x1350: {
                      id: "portrait1080x1350",
                      label: "portrait 1080x1350",
                      onClick: () => handleDimensionChange(1080, 1350)
                    }
                  }
                },
                DimensionSelect: {
                  id: "DimensionSelect",
                  label: (
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "row"
                      }}
                    >
                      <label>w:</label>
                      <input
                        className={style.dimensions_input}
                        type="number"
                        placeholder={width}
                        onBlur={e => {
                          handleDimensionChange(e.target.value, height);
                        }}
                      />
                      <label>h:</label>
                      <input
                        className={style.dimensions_input}
                        type="number"
                        placeholder={height}
                        onBlur={e => {
                          handleDimensionChange(width, e.target.value);
                        }}
                      />
                    </div>
                  )
                }
              },
              style: {
                alignSelf: "flex-end"
              }
            },
            Zoom: {
              id: "Zoom",
              label: (
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row",
                    width: "80px",
                    alignItems: "center"
                  }}
                >
                  <label>zoom: </label>
                  <input
                    className={style.zoom_input}
                    type="number"
                    placeholder={50}
                    step=""
                    onBlur={e => {
                      handleZoomChange(e.target.value);
                    }}
                  />
                  %
                </div>
              )
            }
          }}
        />
      }
      style={
        {
          // zIndex: 0
        }
      }
    >
      <div ref={wrapper_ref} id="canvastest" className={style.canvastest}></div>
    </GenericPanel>
  );
});

export default CanvasDisplay;
