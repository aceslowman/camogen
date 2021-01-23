import React, { useContext, useState } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";

import { PanelComponent } from "maco-ui";
import { observer } from "mobx-react";
import useKeymap from "../hooks/UseKeymap";

const OperatorGraph = observer(props => {
  const store = useContext(MainContext).store;
  const [useKeys, setUseKeys] = useState(false);

  const handleFocus = e => setUseKeys(true);
  const handleBlur = e => setUseKeys(false);
  
  return (
    <PanelComponent
      detachable
      onDetach={props.onDetach ? props.onDetach : () => {}}
      collapsed={props.collapsed}
      //title="Operator Graph"
      onRemove={() => store.workspace.removePanel("Operator Graph")}
      defaultSize={props.defaultSize}
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
      <GraphComponent
        data={props.data.graph}
        coord_bounds={props.coord_bounds}
        selectedNode={props.selectedNode}
        onContextMenu={props.onContextMenu}
        useKeys={useKeys}
      />

      {props.data && props.data.updateFlag}
    </PanelComponent>
  );
});

export default OperatorGraph;
