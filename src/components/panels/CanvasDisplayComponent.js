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
import { getSnapshot } from "mobx-state-tree";

const CanvasDisplay = observer(props => {
  const store = useContext(MainContext).store;
  const [format, setFormat] = useState("PNG");
  const [useKeys, setUseKeys] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [zoom, setZoom] = useState(50);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const wrapper_ref = useRef(null);
  const canvas_ref = useRef(null);
  const panel_ref = useRef(null);

  const [showDimensions, setShowDimensions] = useState(true);
  const [showCapture, setShowCapture] = useState(true);
  const [showTransport, setShowTransport] = useState(false);

  /* I no longer need to set the dimensions for the canvas here */
  useResizeObserver(() => {
    if (store.breakoutControlled) return;
    if (!store.p5_instance) return;

    let inner_bounds = wrapper_ref.current.getBoundingClientRect();
    let panel_bounds = panel_ref.current.parentElement.getBoundingClientRect();

    let offset_x = panel_bounds.width - inner_bounds.width;
    let offset_y = panel_bounds.height - inner_bounds.height;

    let w = Math.round(inner_bounds.width);
    let h = Math.round(inner_bounds.height);

    // if(fit panel)
    // store.resizeCanvas(w, h);

    setWidth(w);
    setHeight(h);

    canvas_ref.current.width = w;
    canvas_ref.current.height = h;
    canvas_ref.current.style.width = w + "px";
    canvas_ref.current.style.height = h + "px";

    redrawCanvas();
  }, wrapper_ref);

  useEffect(() => {
    redrawCanvas();
  }, [zoom, store.canvas, canvas_ref]);

  const redrawCanvas = () => {
    let gl = canvas_ref.current.getContext("2d");
    gl.clearRect(0, 0, gl.canvas.width, gl.canvas.height);
    gl.fillStyle = "#FF0000";
    gl.fillRect(20, 20, 150, 100);
    gl.drawImage(
      store.canvas,
      pan.x,
      pan.y,
      store.canvas.width * (zoom / 100),
      store.canvas.height * (zoom / 100)
    );
  };

  const handleDimensionChange = (w, h) => {
    store.resizeCanvas(w, h);
  };

  const handleZoomChange = amount => setZoom(amount);

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

  useEffect(() => {
    redrawCanvas();
  }, [store.ready, store.canvas, redrawCanvas, canvas_ref, pan, zoom]);

  let toolbar = {};

  if (showDimensions) {
    toolbar = {
      ...toolbar,
      Zoom: {
        // TODO IN PROGRESS
        id: "Zoom",
        label: (
          <div
            style={{
              display: "flex",
              flexFlow: "row",
              width: "105px",
              alignItems: "center"
            }}
          >
            <label>zoom: </label>
            <input
              className={style.zoom_input}
              type="number"
              placeholder={50}
              step=""
              onChange={e => {
                handleZoomChange(e.target.value);
              }}
            />
            %
          </div>
        )
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
      }
    };
  }

  if (showCapture) {
    toolbar = {
      ...toolbar,
      snap: {
        id: "snap",
        title: "snap",
        label: "snap",
        onClick: handleSnap
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
      }
    };
  }

  if (showTransport) {
    toolbar = {
      ...toolbar,
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
          color: store.transport.recording ? "red" : store.ui.theme.text_color
        }
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
      }
    };
  }

  return (
    <GenericPanel
      panel={props.panel}
      showTitle={!props.panel.fullscreen}
      floating={false}
      onRef={panel_ref}
      onContextMenu={() => store.ui.context.setContextmenu()}
      footbar={<ToolbarComponent style={{ zIndex: 0 }} items={toolbar} />}
    >
      <div ref={wrapper_ref} className={style.canvasContainer}>
        <canvas ref={canvas_ref} className={style.canvas} />
      </div>
    </GenericPanel>
  );
});

export default CanvasDisplay;
