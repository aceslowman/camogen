import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../MainContext";
import { PanelComponent, ThemeContext, ControlGroupComponent } from "maco-ui";

// built-in operators
// TODO: remove in favor of single import
import CounterComponent from "./operators/CounterComponent";
import MIDIComponent from "./operators/MIDIComponent";
import FloatComponent from "./operators/FloatComponent";

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

  /*
    this isn't the best way to do this, it's *different* than
    how it's being done in the ShaderControls. for now it works,
    but this is a place for improvement
  */
  const generateInterface = e => {
    return null;
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
      <ControlsComponent 
        data={props.data} 
        generateInterface={generateInterface}
      />
    </PanelComponent>
  );
});

export default OperatorControls;
