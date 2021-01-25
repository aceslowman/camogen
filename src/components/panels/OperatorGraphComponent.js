import React, { useContext, useState } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { PanelComponent } from "maco-ui";
import { observer } from "mobx-react";
import useKeymap from "../hooks/UseKeymap";

const OperatorGraph = observer(props => {
  const store = useContext(MainContext).store;
  const [useKeys, setUseKeys] = useState(false);

  const handleFocus = e => setUseKeys(true);
  const handleBlur = e => setUseKeys(false);
  
  const handlePanelContextMenu = e => {
    e.stopPropagation();

    store.context.setContextmenu({
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
                console.log("GRAPH", getSnapshot(props.data.graph));
              }
            }
          }
        : {})
    });
  };
  console.log('hit opgraph', getSnapshot(props.data.graph))
  return (
    <PanelComponent
      detachable
      onDetach={props.onDetach ? props.onDetach : () => {}}
      // collapsed={props.collapsed}
      //title="Operator Graph"
      onRemove={() => store.workspace.removePanel("Operator Graph")}
      defaultSize={props.defaultSize}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onContextMenu={handlePanelContextMenu}
      //indicators={
      //  useKeys
      //   ? [
      //        {
      //          label: "k",
      //          color: store.ui.theme.accent_color,
      //          title: "Keybind Focus"
      //        }
      //      ]
      //    : null
      //}
    >
      <GraphComponent
        data={props.data.graph}
        onContextMenu={props.onContextMenu}
        useKeys={useKeys}
      />

      {props.data && props.data.updateFlag}
    </PanelComponent>
  );
});

export default OperatorGraph;
