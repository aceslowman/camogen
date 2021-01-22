import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../MainContext";
import { PanelComponent, ThemeContext, ControlGroupComponent } from "maco-ui";
import CounterComponent from "./operators/inputs/CounterComponent";
import MIDIComponent from "./operators/inputs/MIDIComponent";
import FloatComponent from "./operators/inputs/FloatComponent";
import ControlsComponent from "../controls/ControlsComponent";
import styles from "./OperatorControlsComponent.module.css";
import { observer } from "mobx-react";

import { getSnapshot, isAlive } from "mobx-state-tree";
import { branch_colors } from "../../stores/GraphStore";

const OperatorControls = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  
  const [useKeys, setUseKeys] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const handleRemove = () => {
    store.workspace.removePanel("OPERATOR_CONTROLS");
  };

  const generateInterface = e => {
    let controls = null;

    console.log('hello?', e)
    
    if (e) {
      let c;

      switch (e.name) {
        case "Counter":
          c = (<CounterComponent data={e} />);
          break;
        case "MIDI":
          c = (<MIDIComponent data={e} />);
          break;
        case "Float":
          c = (<FloatComponent data={e} />);
          break;
        default:          
          break;
      }

      controls = c;
    } else {
      // this fallback is for addition, subtraction, etc, controlless nodes
      controls = (<ControlGroupComponent></ControlGroupComponent>)
    }

    return controls;
  };

  return (
    <PanelComponent
      //title="Op Controls"
      onRemove={handleRemove}
      className={styles.shader_graph}
      defaultSize={props.defaultSize}
      detachable
      onDetach={props.onDetach ? props.onDetach : () => {}}
    >
      {/*props.data.nodes && panels*/}
      <ControlsComponent 
        data={props.data}  
        selectedNode={props.selectedNode}
        generateInterface={generateInterface}
      />
    </PanelComponent>
  );
});

export default OperatorControls;
