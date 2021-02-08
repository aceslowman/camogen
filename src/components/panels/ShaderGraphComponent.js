import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";

const ShaderGraph = observer(props => {
  const store = useContext(MainContext).store;
  
  const data = store.scene.shaderGraph;
  
  // const { clipboard } = props.data;
  const { clipboard } = data;
  const [useKeys, setUseKeys] = useState(false);
  const mainRef = useRef();

  const handleFocus = e => setUseKeys(true);
  const handleBlur = e => setUseKeys(false);

  const handleContextMenu = (e, node) => {
    e.stopPropagation();
    e.preventDefault();

    node.select(); // select with right click
    store.ui.context.setContextmenu({
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
          store.ui.context.setContextmenu(); // removes menu
        }
      },
      EditShader: {
        id: "EditShader",
        label: "Edit Shader",
        onClick: () => {
          let variant = store.ui.getLayoutVariant("SHADER_EDIT");
          store.ui.getPanel("MAIN").setLayout(variant);
          store.ui.context.setContextmenu(); // removes menu
        }
      },
      ResetToDefault: {
        id: "ResetToDefault",
        label: "Reset To Default",
        onClick: () => {
          node.data.resetToDefault();
        }
      },
      ...(process.env.NODE_ENV === "development"
        ? {
            PrintDebug: {
              id: "PrintDebug",
              label: <em>Print Debug</em>,
              onClick: () => {
                console.log(
                  props.data.selectedNode.name,
                  getSnapshot(props.data.selectedNode)
                );
              }
            }
          }
        : {})
    });
  };

  const handlePanelContextMenu = e => {
    e.stopPropagation();

    store.ui.context.setContextmenu({
      Clear: {
        id: "Clear",
        label: "Clear",
        onClick: () => store.scene.clear()
      },
      ...(process.env.NODE_ENV === "development"
        ? {
            PrintDebug: {
              id: "PrintDebug",
              label: <em>Print Debug</em>,
              onClick: () => {
                console.log("GRAPH", getSnapshot(props.data));
              }
            }
          }
        : {})
    });
  };

  return (
    <GenericPanel
      panel={props.panel}
      onContextMenu={handlePanelContextMenu}
      onFocus={handleFocus}
      onBlur={handleBlur}
      indicators={
        useKeys
          ? [
              {
                label: "k",
                color: store.ui.theme.accent_color,
                title: "Keybind Focus"
              }
            ]
          : null
      }
    >
      {props.data && (
        <GraphComponent
          onRef={mainRef}
          data={props.data}
          onContextMenu={handleContextMenu}
          useKeys={useKeys}
        />
      )}

      {props.data && props.data.updateFlag}
    </GenericPanel>
  );
});

export default ShaderGraph;
