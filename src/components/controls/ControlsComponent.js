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

// built in inputs
import SketchInputComponent from "../panels/shaders/SketchInputComponent";
import WebcamInputComponent from "../panels/shaders/WebcamInputComponent";
import ImageInputComponent from "../panels/shaders/ImageInputComponent";
import TextInputComponent from "../panels/shaders/TextInputComponent";

// built in operators


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
      let is_selected = props.selectedNode === node;

      if (node.data) {
        let controls = null;
        switch (node.data.name) {
          case "Webcam":
            controls = (
              <WebcamInputComponent key={node.uuid} ref={refs[i]} data={node} />
            );
            break;
          case "Image":
            controls = (
              <ImageInputComponent key={node.uuid} ref={refs[i]} data={node} />
            );
            break;
          case "Text":
            controls = (
              <TextInputComponent key={node.uuid} ref={refs[i]} data={node} />
            );
            break;
          case "Sketch":
            controls = (
              <SketchInputComponent key={node.uuid} ref={refs[i]} data={node} />
            );
            break;
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
              subtitle={(
                <InputBool 
                  //hLabel
                  //label="bypass"
                  value={node.bypass}  
                  onChange={node.toggleBypass}
                />
              )}
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
      props.data.nodes && panels
  );
});

export default Controls;
