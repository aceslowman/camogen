import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import MainContext from "../../MainContext";
import {
  PanelComponent,
  GenericPanel,
  ControlGroupComponent,
  InputBool,
  InputFloat,
  ThemeContext,
  ToolbarComponent
} from "maco-ui";

// built-in operators
import { OperatorComponents } from "../panels/operators";

// built in inputs
import { ShaderComponents } from "../panels/shaders";

import styles from "./ControlsComponent.module.css";
import { observer } from "mobx-react";
import { getSnapshot, isAlive } from "mobx-state-tree";
import { branch_colors } from "../../stores/GraphStore";

const Controls = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [useKeys, setUseKeys] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const handleValueChange = (param, e) => {
    param.setValue(e);
  };

  let refs = [];
  const panels = [];

  const addPanelRef = (panel, id) => {
    refs = [...refs, { [id]: panel }];
  };

  const handleSubpanelRef = (r, node) => {
    if (isAlive(node)) addPanelRef(r, node.uuid);
  };
  
  props.data.queue.forEach(subqueue => {
    subqueue.forEach((node, i) => {
      let subpanels = [];
      let is_selected = props.data.selectedNode === node;
      // console.log('NODE', getSnapshot(node))
      if (node.data) {
        let controls = null;
        
        //TODO procedurally create shaders
        if(ShaderComponents.has(node.data.name)) {
          let component = ShaderComponents.get(node.data.name);
          controls = (<component key={node.uuid} ref={refs[i]} data={node} />);
        }
        
        // TODO procedurally create operators
        if(OperatorComponents.has(node.data.name)) {
          let component = OperatorComponents.get(node.data.name);
          controls = (<component key={node.uuid} ref={refs[i]} data={node} />);
        }
        
        switch (node.data.name) {
          // OPERATORS
          // case "Counter":
          //   controls = (
          //     <CounterComponent key={node.uuid} ref={refs[i]} data={node} />
          //   );
          //   break;
          // case "MIDI":
          //   controls = (
          //     <MIDIComponent key={node.uuid} ref={refs[i]} data={node} />
          //   );
          //   break;
          // case "Float":
          //   controls = (
          //     <FloatComponent key={node.uuid} ref={refs[i]} data={node} />
          //   );
          //   break;
          default:
            controls = props.generateInterface(node.data);
        }
        // console.log('CHECK', controls)

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
              subtitle={
                <InputBool
                  //hLabel
                  //label="bypass"
                  value={node.bypass}
                  onChange={node.toggleBypass}
                />
              }
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
          style={
            {
              // marginLeft: node.trunk_distance * 5,
            }
          }
        >
          {subpanels}
        </ul>
      );
    });
  });

  useEffect(() => {
    // scroll panels into view when they are selected.
    refs.forEach((e, i) => {
      if (Object.keys(e)[0] === props.data.selectedNode.uuid) {
        e[props.data.selectedNode.uuid].scrollIntoView({
          block: "center"
          // bug in chrome for 'smooth'
          // behavior: 'smooth'
        });
      }
    });
  }, [props.data.selectedNode]);

  return (panels);
});

export default Controls;
