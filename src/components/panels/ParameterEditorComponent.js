import React from "react";
import OperatorGraph from "./OperatorGraphComponent";
import styles from "./ParameterEditorComponent.module.css";

import { GenericPanel, SplitContainer, ToolbarComponent } from "maco-ui";
import { observer } from "mobx-react";
import OperatorControls from "./OperatorControlsComponent";

const OperatorEditor = observer(props => {
  const { data } = props;
  const graph = data ? data.graph : null;
  
  console.log()

  const toolbar = props.data && (
    <ToolbarComponent
      items={[
        {
          label: "Inputs",
          dropDown: [
            {
              label: "MIDI",
              onClick: () => graph.setSelectedByName("MIDI")
            },
            {
              label: "Counter",
              onClick: () => graph.setSelectedByName("Counter")
            }
          ]
        },
        {
          label: "Operators",
          dropDown: [
            {
              label: "Add",
              onClick: () => graph.setSelectedByName("Add")
            },
            {
              label: "Subtract",
              onClick: () => graph.setSelectedByName("Subtract")
            },
            {
              label: "Divide",
              onClick: () => graph.setSelectedByName("Divide")
            },
            {
              label: "Multiply",
              onClick: () => graph.setSelectedByName("Multiply")
            },
            {
              label: "Modulus",
              onClick: () => graph.setSelectedByName("Modulus")
            }
          ]
        },
        {
          label: "Trig",
          dropDown: [
            {
              label: "Sine",
              onClick: () => graph.setSelectedByName("Sin")
            },
            {
              label: "Cosine",
              onClick: () => graph.setSelectedByName("Cos")
            },
            {
              label: "Tangent",
              onClick: () => graph.setSelectedByName("Tan")
            }
          ]
        }
      ]}
    />
  );

  return (
    <GenericPanel
      panel={props.panel}
      toolbar={data && toolbar}
      title=" "
      subtitle={data ?`${data.uniform.shader.name} > ${data.uniform.name} > ${data.name}`}
    >
      {data && (
        <SplitContainer vertical>
          <OperatorGraph
            data={data}
            selectedNode={data.graph.selectedNode}
            coord_bounds={props.coord_bounds}
          />
          <OperatorControls data={graph} />
        </SplitContainer>
      )}

      {!props.data && (
        <p className={styles.no_node_selected}>
          <em> no param selected</em>
        </p>
      )}
    </GenericPanel>
  );
});

export default OperatorEditor;
