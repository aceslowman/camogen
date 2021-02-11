import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";

const ShaderGraph = observer(props => {
  const store = useContext(MainContext).store;

  const data = store.scene.shaderGraph;

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
          data.removeNode(node);
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
                  data.selectedNode.name,
                  getSnapshot(data.selectedNode)
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
                console.log("GRAPH", getSnapshot(data));
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
      tooltip={
        <React.Fragment>
          <h2>Shader Graph</h2>
          <p>
            Here you can combine your effects into a graph. You can right-click on any node to access the library and change the effect.
          </p>

          <p>Keyboard Shortcuts:</p>
          <p>
            <em>First, click within the graph to focus the keymap!</em>
          </p>

          <table style={{width:'100%'}}>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
            <tr>
              <td>Arrows</td>
              <td>Select Node</td>
            </tr>
            <tr>
              <td>Delete</td>
              <td>Remove Selected</td>
            </tr>
            <tr>
              <td>B</td>
              <td>Bypass Selected</td>
            </tr>
          </table>
        </React.Fragment>
      }
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
      {data && (
        <GraphComponent
          onRef={mainRef}
          data={data}
          onContextMenu={handleContextMenu}
          useKeys={useKeys}
        />
      )}

      {data && data.updateFlag}
    </GenericPanel>
  );
});

export default ShaderGraph;
