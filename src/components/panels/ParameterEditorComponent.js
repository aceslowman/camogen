import React, {useContext} from "react";
import OperatorGraph from "./OperatorGraphComponent";
import styles from "./ParameterEditorComponent.module.css";
import { opList } from "../../stores/operators";

import { GenericPanel, SplitContainer, ToolbarComponent } from "maco-ui";
import { observer } from "mobx-react";
import OperatorControls from "./OperatorControlsComponent";
import MainContext from "../../MainContext";

const OperatorEditor = observer(props => {
  const { data } = props;
  const store = useContext(MainContext).store;
  const { ui } = store;
  const graph = data ? data.graph : null;

  const ctxmenu = {
    Inputs: {
      id: "Inputs",
      label: "Inputs",
      dropDown: {
        MIDI: {
          id: "MIDI",
          label: "MIDI",
          onClick: () => graph.setSelectedByName("MIDI")
        },
        Counter: {
          id: "Counter",
          label: "Counter",
          onClick: () => graph.setSelectedByName("Counter")
        },
        Float: {
          id: "Float",
          label: "Float",
          onClick: () => graph.setSelectedByName("Float")
        }
      }
    },
    Operators: {
      id: "Operators",
      label: "Operators",
      dropDown: {
        Add: {
          id: "Add",
          label: "Add",
          onClick: () => graph.setSelectedByName("Add")
        },
        Subtract: {
          id: "Subtract",
          label: "Subtract",
          onClick: () => graph.setSelectedByName("Subtract")
        },
        Divide: {
          id: "Divide",
          label: "Divide",
          onClick: () => graph.setSelectedByName("Divide")
        },
        Multiply: {
          id: "Multiply",
          label: "Multiply",
          onClick: () => graph.setSelectedByName("Multiply")
        },
        Modulus: {
          id: "Modulus",
          label: "Modulus",
          onClick: () => graph.setSelectedByName("Modulus")
        }
      }
    },
    Trig: {
      id: "Trig",
      label: "Trig",
      dropDown: {
        Sine: {
          id: "Sine",
          label: "Sine",
          onClick: () => graph.setSelectedByName("Sin")
        },
        Cosine: {
          id: "Cosine",
          label: "Cosine",
          onClick: () => graph.setSelectedByName("Cos")
        },
        Tangent: {
          id: "Tangent",
          label: "Tangent",
          onClick: () => graph.setSelectedByName("Tan")
        }
      }
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
  };

  const handleContextMenu = (e, node) => {
    e.stopPropagation();
    e.preventDefault();

    node.select(); // select with right click
    store.context.setContextmenu(ctxmenu);
  };

  // TODO: these should autopopulate from available operators
  // console.log("HEY CHECK", opList);

  const toolbar = props.data && <ToolbarComponent items={ctxmenu} />;

  return (
    <GenericPanel
      panel={props.panel}
      toolbar={data && toolbar}
      title=" "
      subtitle={
        data &&
        `${data.uniform.shader.name} > ${data.uniform.name} > ${data.name}`
      }
    >
      {data && (
        <SplitContainer vertical>
          <OperatorGraph
            data={data}
            onContextMenu={handleContextMenu}
            selectedNode={data.graph.selectedNode}
            coord_bounds={props.coord_bounds}
          />
          <OperatorControls data={graph} selectedNode={data.graph.selectedNode}/>
        </SplitContainer>
      )}

      {!data && (
        <p className={styles.no_node_selected}>
          <em> no param selected</em>
        </p>
      )}
    </GenericPanel>
  );
});

export default OperatorEditor;
