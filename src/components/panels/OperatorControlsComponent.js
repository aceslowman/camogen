import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../MainContext";
import { PanelComponent, ThemeContext } from "maco-ui";
import CounterComponent from "./operators/inputs/CounterComponent";
import MIDIComponent from "./operators/inputs/MIDIComponent";
import FloatComponent from "./operators/inputs/FloatComponent";

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

    if (e.data) {
      let c;

      switch (e.data.name) {
        case "Counter":
          c = <CounterComponent data={e.data} />;
          break;
        case "MIDI":
          c = <MIDIComponent data={e.data} />;
          break;
        case "Float":
          c = <FloatComponent data={e.data} />;
          break;
        default:
          break;
      }

      controls = c;
    }

    return controls;
  };

  let refs = [];
  const panels = [];

  const addPanelRef = (panel, id) => {
    refs = [...refs, { [id]: panel }];
  };

  const handleSubpanelRef = (r, node) => {
    if (isAlive(node)) addPanelRef(r, node.uuid);
  };

  if (props.data) { // can I remove this?
    props.data.queue.forEach(subqueue => {
      subqueue.forEach((node, i) => {
        let subpanels = [];
        let is_selected = props.data.selectedNode === node;

        if (node.data) {
          let controls = generateInterface(node);
          
          subpanels.push(
            <li
              key={node.uuid}
              ref={r => handleSubpanelRef(r, node)}
              style={{
                borderLeft: `3px solid ${branch_colors[node.branch_index]}`
              }}
            >
              <PanelComponent
                title={node.data.name}
                collapsible={controls ? true : false}
                titleStyle={{
                  color: is_selected ? theme.text_color : theme.text_color,
                  backgroundColor: is_selected
                    ? theme.accent_color
                    : theme.primary_color
                }}
                expanded={expandAll}
                onRemove={() => node.remove()}
                gutters
              >
                {controls}
              </PanelComponent>
            </li>
          );
        }

        panels.push(
          <ul
            key={node.uuid}
            className={styles.listtree}
          >
            {subpanels}
          </ul>
        );
      });
    });
  }
  
  // this should all be refactored into a single Controls component in maco-ui
  useEffect(() => {
    // scroll panels into view when they are selected.
    refs.forEach((e, i) => {
      if (Object.keys(e)[0] === props.selectedNode.uuid) {
        e[props.selectedNode.uuid].scrollIntoView({
          block: "center"
          // bug in chrome for 'smooth'
          // behavior: 'smooth'
        });
      }
    });
  }, [props.data.selectedNode]);


  return (
    <PanelComponent
      //title="Op Controls"
      onRemove={handleRemove}
      className={styles.shader_graph}
      defaultSize={props.defaultSize}
      detachable
      onDetach={props.onDetach ? props.onDetach : () => {}}
    >
      {props.data.nodes && panels}
    </PanelComponent>
  );
});

export default OperatorControls;
