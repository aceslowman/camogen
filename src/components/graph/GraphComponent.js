import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useContext
} from "react";
import styles from "./GraphComponent.module.css";
import { observer } from "mobx-react";
import { ThemeContext } from "maco-ui";
import useResizeObserver from "../hooks/ResizeHook";
import { branch_colors } from "../../stores/GraphStore";
import MainContext from "../../MainContext";
import GraphNode from "../../stores/GraphStore";
import { getSnapshot } from "mobx-state-tree";
import { nanoid } from "nanoid";

const GraphComponent = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const { clipboard } = props.data;
  const wrapper_ref = useRef(null);
  const canvas_ref = useRef(null);
  const [labels, setLabels] = useState([]);

  const drawGraph = () => {
    const ctx = canvas_ref.current.getContext("2d");
    const wrapper_bounds = wrapper_ref.current.getBoundingClientRect();
    let _labels = [];

    canvas_ref.current.width = wrapper_ref.current.offsetWidth;
    canvas_ref.current.height = wrapper_ref.current.offsetHeight;

    let spacing = {
      x: wrapper_bounds.width / (props.data.coord_bounds.x + 1),
      y: wrapper_bounds.height / (props.data.coord_bounds.y + 1)
    };

    let draw_grid = true;
    if (draw_grid) {
      for (let i = 0; i < canvas_ref.current.width / (spacing.x / 2); i++) {
        for (let j = 0; j < canvas_ref.current.height / (spacing.y / 2); j++) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = theme.secondary_color;
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.moveTo(i * (spacing.x / 2), 0);
          ctx.lineTo(i * (spacing.x / 2), canvas_ref.current.height);
          ctx.closePath();
          ctx.stroke();

          ctx.lineWidth = 1;
          ctx.strokeStyle = theme.secondary_color;
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.moveTo(0, j * (spacing.y / 2));
          ctx.lineTo(canvas_ref.current.width, j * (spacing.y / 2));
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    ctx.save();
    ctx.translate(spacing.x / 2, -spacing.y / 2);
    props.data.nodes.forEach((node, i) => {
      let x = node.coordinates.x;
      let y = node.coordinates.y;

      if (x) x *= spacing.x;
      if (y) y *= spacing.y;

      // inverts on y-axis
      y = wrapper_ref.current.offsetHeight - y;

      // for(let parent of node.parents) {
      node.parents.forEach((parent, p_i) => {
        let cx = parent.coordinates.x;
        let cy = parent.coordinates.y;

        if (cx) cx *= spacing.x;
        if (cy) cy *= spacing.y;

        // inverts on y-axis
        cy = wrapper_ref.current.offsetHeight - cy;

        // left/right cable
        ctx.lineWidth = 2;
        ctx.strokeStyle = branch_colors[parent.branch_index];
        ctx.beginPath();
        ctx.moveTo(x, y - spacing.y / 2);
        ctx.lineTo(cx, y - spacing.y / 2);
        ctx.closePath();
        ctx.stroke();

        // top downward cable
        ctx.beginPath();
        ctx.moveTo(cx, y - spacing.y);
        ctx.lineTo(cx, y - spacing.y / 2);
        ctx.closePath();
        ctx.stroke();

        if (node.parents.length > 0) {
          ctx.strokeStyle = branch_colors[node.branch_index];
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, cy + spacing.y / 2);
          ctx.closePath();
          ctx.stroke();
        }

        // direction triangle
        ctx.fillStyle = branch_colors[parent.branch_index];
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + spacing.y * 0.35 - 8);
        ctx.lineTo(cx + 8, cy + spacing.y * 0.35 - 8);
        ctx.lineTo(cx, cy + 8 + spacing.y * 0.35 - 8);
        ctx.closePath();
        ctx.fill();
      });

      let label_border_color = theme.text_color;
      let label_border_style = node.data ? "solid" : "dashed";
      let label_text_color = theme.text_color;
      let label_background_color = node.data
        ? theme.secondary_color
        : theme.primary_color;

      // bypass indicator
      if (node.bypass) {
        label_border_color = theme.accent_color;
        label_background_color = theme.primary_color;
        label_border_style = "dashed";
      }

      if (node.isActiveSelection) {
        label_border_style = "solid";
        label_text_color = theme.primary_color;
        label_background_color = theme.accent_color;
      } else if (node.isSelected) {
        label_border_style = "dotted";
        label_text_color = theme.accent_color;
        label_background_color = theme.secondary_color;
      }

      if (
        node === props.data.clipboard.selection[0] &&
        props.data.clipboard.selection.length > 1
      ) {
        label_border_style = "dashed";
        label_border_color = theme.accent_color;
      }

      // insert labels BELOW node
      // if node has children...
      if (node.children.length) {
        _labels.push(
          <div
            key={"insert_" + node.uuid}
            title="insert node"
            className={`${styles.label} ${styles.insert}`}
            style={{
              left: Math.floor(x + spacing.x / 2 - 15),
              top: Math.floor(y - 15)
            }}
          >
            <div
              style={{
                backgroundColor: theme.primary_color,
                borderColor: theme.text_color,
                color: theme.text_color
              }}
              onContextMenu={e => {
                // insert new node then open context menu
                props.data.insertBelow(node).select();
                props.data.setSelectedByName("Thru");
                props.onContextMenu(e, node);
              }}
              onClick={() => {
                props.data.insertBelow(node).select();
                props.data.setSelectedByName("Thru");
              }}
            >
              +
            </div>
          </div>
        );
      }

      // node labels
      _labels.push(
        <div
          key={"label_" + node.uuid}
          className={`
            ${styles.label}
          `}
          onClick={() => node.select()}
          onContextMenu={e => props.onContextMenu(e, node)}
          style={{
            left: x + spacing.x / 2 - 15,
            top: y - spacing.y / 2 - 15
          }}
        >
          <label
            title={node.name}
            style={{
              backgroundColor: label_background_color,
              borderColor: label_border_color,
              borderStyle: label_border_style,
              color: label_text_color,
              textDecoration: node.bypass ? "line-through" : "none"
            }}
          >
            {node.name}
          </label>
        </div>
      );
    });

    setLabels(_labels);
  };

  // TODO: this causes way too many redraws!
  useResizeObserver(drawGraph, wrapper_ref);

  useLayoutEffect(() => {
    drawGraph();
  }, [
    props.data.coord_bounds,
    props.data.selectedNode.data,
    props.data.nodes,
    props.data.nodes.size,
    props.data.root // helped with clear() rerender
  ]);

  // TODO: swap out with useKeymap hook?
  useEffect(() => {
    if (props.useKeys) {
      store.ui.context.setKeymap({
        // redo
        "$mod+KeyZ": () => {
          if (process.env.NODE_ENV === "development") {
            if (props.data.history.canUndo) {
              console.log("UNDO", getSnapshot(props.data.history));
              props.data.history.undo();
              props.data.update();
              props.data.afterUpdate();
            } else {
              console.log("all out of undo");
            }
          }
        },
        // undo
        "$mod+Shift+KeyZ": () => {
          if (process.env.NODE_ENV === "development") {
            if (props.data.history.canRedo) {
              console.log("REDO", getSnapshot(props.data.history));
              props.data.history.redo();
              props.data.update();
              props.data.afterUpdate();
            } else {
              console.log("all out of redo");
            }
          }
        },
        // bypass
        b: () => {
          props.data.selectedNode.toggleBypass();
        },
        // select up
        ArrowUp: () => {
          if (props.data.selectedNode && props.data.selectedNode.parents.length)
            props.data.selectedNode.parents[0].select();
        },
        // select down
        ArrowDown: () => {
          if (props.data.selectedNode && props.data.selectedNode.children.length)
            props.data.selectedNode.children[0].select();
        },
        // select left
        ArrowLeft: () => {
          if (props.data.selectedNode && props.data.selectedNode.children.length) {
            let idx = props.data.selectedNode.children[0].parents.indexOf(
              props.data.selectedNode
            );
            idx--;

            if (idx >= 0) {
              props.data.selectedNode.children[0].parents[idx].select();
            }
          }
        },
        // select right
        ArrowRight: () => {
          if (props.data.selectedNode && props.data.selectedNode.children.length) {
            let idx = props.data.selectedNode.children[0].parents.indexOf(
              props.data.selectedNode
            );
            idx++;

            if (idx <= props.data.selectedNode.children[0].parents.length - 1)
              props.data.selectedNode.children[0].parents[idx].select();
          }
        },
        // add selection up
        "Shift+ArrowUp": () => {
          if (props.selectedNode && props.selectedNode.parents.length) {
            let next = props.selectedNode.parents[0];

            if (clipboard.selection.includes(next)) {
              clipboard.removeSelection(props.selectedNode);
            } else {
              clipboard.addSelection(next);
            }
          }
        },
        // add selection down
        "Shift+ArrowDown": () => {
          if (props.data.selectedNode && props.data.selectedNode.children.length) {
            let next = props.data.selectedNode.children[0];

            if (clipboard.selection.includes(next)) {
              clipboard.removeSelection(props.data.selectedNode);
            } else {
              clipboard.addSelection(next);
            }
          }
        },
        // add selection left
        "Shift+ArrowLeft": () => {
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx--;
          //             if (idx >= 0) {
          //               props.selectedNode.children[0].parents[idx].select();
          //             }
          //           }
        },
        // add selection right
        "Shift+ArrowRight": () => {
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx++;
          //             if (idx <= props.selectedNode.children[0].parents.length - 1)
          //               props.selectedNode.children[0].parents[idx].select();
          //           }
        },
        // swap up
        "$mod+Shift+ArrowUp": () => {
          if (props.data.selectedNode && props.data.selectedNode.parents.length)
            if (props.data.selectedNode.parents[0].parents.length)
              props.data.selectedNode.swapData(
                props.data.selectedNode.parents[0].select()
              );
        },
        // swap down
        "$mod+Shift+ArrowDown": () => {
          if (props.data.selectedNode && props.data.selectedNode.children.length)
            props.data.selectedNode.swapData(
              props.data.selectedNode.children[0].select()
            );
        },
        // swap left
        "$mod+Shift+ArrowLeft": () => {
          //           console.log("Shift+ArrowLeft");
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx--;
          //             if (idx >= 0) {
          //               props.selectedNode.children[0].parents[idx].select();
          //             }
          //           }
        },
        // swap right
        "$mod+Shift+ArrowRight": () => {
          //           console.log("Shift+ArrowRight");
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx++;
          //             if (idx <= props.selectedNode.children[0].parents.length - 1)
          //               elect();
          //           }
        },
        // delete
        Delete: () => {
          console.log('deleting')
          props.data.removeSelected();
        },
        // copy
        "$mod+c": () => {
          if (process.env.NODE_ENV === "development") clipboard.copy();
        },
        // cut
        "$mod+x": () => {
          if (process.env.NODE_ENV === "development") clipboard.cut();
        },
        // paste
        "$mod+v": () => {
          if (process.env.NODE_ENV === "development") {
            clipboard.paste();
            props.data.update();
            props.data.afterUpdate();
          }
        }
      });
    } else {
      store.ui.context.removeKeymap();
    }
  }, [
    props.data.selectedNode,
    props.data.history,
    props.data,
    store.context,
    props.useKeys    
  ]);

  return (
    <div ref={wrapper_ref} className={styles.wrapper}>
      <canvas ref={canvas_ref} className={styles.canvas} />
      <div className={styles.labels}>{labels}</div>
    </div>
  );
});

export default GraphComponent;
