import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel } from "../../ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";

const ShaderGraph = props => {
  const store = useContext(MainContext).store;

  const data = store.scene.shaderGraph;
//   const [data, setData] = useState();
  
//   useLayoutEffect(() => {setData(store.scene.shaderGraph)}, [store.scene.shaderGraph])

  // const { clipboard } = data;
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
      /*
        4-8-24 NOTE:

        this is disabled because there are some issues with getting some things to 
        play with ../../ui. not really necessary to have these kinds of buttons

        TODO re-enable this
      */      
      EditShader: {
        id: "EditShader",
        label: "Edit Shader",
        onClick: () => {
          console.log('here', store.ui)
          
          let variant = store.ui.getLayout("SHADER_EDITOR");
          store.ui.applyLayoutToMainPanel(variant)
          // store.ui.getPanel("MAIN").setLayout(variant);
          store.ui.context.setContextmenu(); // removes menu
        }
      },
      /*
        4-12-24 NOTE:

        this is a confusing button without much use
      */
      // ResetToDefault: {
      //   id: "ResetToDefault",
      //   label: "Reset To Default",
      //   onClick: () => {
      //     node.data.resetToDefault();
      //   }
      // },
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

  const handleNodeSelect = shaderNode => {
    /* select the shader for editing */
    if (shaderNode.data) {
      store.selectShader(shaderNode.data.collection);
    } else {
      store.selectShader(undefined);
    }
  };

  return (
    <GenericPanel
      showTitle={false}
      panel={props.panel}
      onContextMenu={handlePanelContextMenu}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tooltip={
        <React.Fragment>
          <p>
            Here you can combine your effects into a graph. You can right-click
            on any node to access the library and change the effect.
          </p>

          <hr />

          <p>Keyboard Shortcuts:</p>
          <p>
            <em>
              <small>First, click within the graph to focus the keymap!</small>
            </em>
          </p>

          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
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
          onNodeSelect={handleNodeSelect}
        />
      )}

      {data && data.updateFlag}
    </GenericPanel>
  );
};

export default observer(ShaderGraph);
