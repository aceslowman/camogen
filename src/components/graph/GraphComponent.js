import React, { useRef, useLayoutEffect, useState, useContext } from "react";
import styles from "./GraphComponent.module.css";
import { observer } from "mobx-react";
import { ThemeContext } from "maco-ui";
import useResizeObserver from "../hooks/ResizeHook";
import { branch_colors } from "../../stores/GraphStore";
import MainContext from "../../MainContext";
import Shader from "../../stores/ShaderStore";
import GraphNode from "../../stores/GraphStore";
import { getSnapshot } from "mobx-state-tree";
import { nanoid } from "nanoid";

const GraphComponent = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const wrapper_ref = useRef(null);
  const canvas_ref = useRef(null);
  const [labels, setLabels] = useState([]);

  const handleContextMenu = (e, node) => {
    e.stopPropagation();
    e.preventDefault();

    node.select(); // select with right click
    store.context.setContextmenu({
      Library: {
        id: "Library",
        label: "Library",
        dropDown: store.shaderLibrary
      },
      Delete: {
        id: "Delete",
        label: "Delete",
        onClick: () => {
          props.data.removeNode(node);
          store.context.setContextmenu(); // removes menu
        }
      },
      EditShader: {
        id: "EditShader",
        label: "Edit Shader",
        onClick: () => {
          let variant = store.ui.getLayoutVariant("SHADER_EDIT");
          store.ui.getPanel("MAIN").setLayout(variant);
          store.context.setContextmenu(); // removes menu
        }
      }
    });
  };

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
      
      if (props.data.selectedNode === node) {
        label_text_color = theme.primary_color;
        label_background_color = theme.accent_color;        
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
                handleContextMenu(e, node);
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
            ${node.isSelected ? styles.selected : ""}
            ${node.isActiveSelection ? styles.activeSelected : ""}     
          `}
          onClick={() => node.select()}
          onContextMenu={e => handleContextMenu(e, node)}
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
              textDecoration: node.bypass ? 'line-through' : 'none'
            }}
          >
            {node.name}
          </label>
        </div>
      );
    });

    setLabels(_labels);
  };

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

  return (
    <div ref={wrapper_ref} className={styles.wrapper}>
      <canvas ref={canvas_ref} className={styles.canvas} />
      <div className={styles.labels}>{labels}</div>
    </div>
  );
});

export default GraphComponent;
0;
