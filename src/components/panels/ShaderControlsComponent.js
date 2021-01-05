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

import styles from "./ShaderControlsComponent.module.css";
import { observer } from "mobx-react";
import { getSnapshot, isAlive } from "mobx-state-tree";
import { branch_colors } from "../../stores/GraphStore";

// built in inputs
import SketchInputComponent from "./shaders/SketchInputComponent";
import WebcamInputComponent from "./shaders/WebcamInputComponent";
import ImageInputComponent from "./shaders/ImageInputComponent";
import TextInputComponent from "./shaders/TextInputComponent";

const ShaderControls = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [useKeys, setUseKeys] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const handleFocus = e => {
    // setUseKeys(true);
  };

  const handleBlur = e => {
    // setUseKeys(false);
  };

  // TODO: this is currently breaking the keymap in shadergraph
  //   useEffect(() => {
  //     if (useKeys) {
  //       store.context.setKeymap({
  //         ArrowUp: () => {
  //           if (props.selectedNode && props.selectedNode.parents.length)
  //             props.selectedNode.parents[0].select();
  //         },
  //         ArrowDown: () => {
  //           if (props.selectedNode && props.selectedNode.children.length)
  //             props.selectedNode.children[0].select();
  //         },
  //         ArrowLeft: () => {
  //           if (props.selectedNode && props.selectedNode.children.length) {
  //             let idx = props.selectedNode.children[0].parents.indexOf(
  //               props.selectedNode
  //             );
  //             idx--;

  //             if (idx >= 0) {
  //               props.selectedNode.children[0].parents[idx].select();
  //             }
  //           }
  //         },
  //         ArrowRight: () => {
  //           if (props.selectedNode && props.selectedNode.children.length) {
  //             let idx = props.selectedNode.children[0].parents.indexOf(
  //               props.selectedNode
  //             );
  //             idx++;

  //             if (idx <= props.selectedNode.children[0].parents.length - 1)
  //               props.selectedNode.children[0].parents[idx].select();
  //           }
  //         },
  //         Delete: () => {
  //           props.data.removeSelected();
  //         }
  //       });
  //     } else {
  //       store.context.removeKeymap();
  //     }
  //   }, [props.selectedNode, props.data, store.context, useKeys]);

  const handleValueChange = (param, e) => {
    param.setValue(e);
  };

  const handleParameterContextMenu = (e, param) => {
    // TODO: adding onContextMenu to inputs
    e.stopPropagation();
    e.preventDefault();

    store.context.setContextmenu({
      ParamEdit: {
        id: "ParamEdit",
        label: "Edit Parameter",
        onClick: () => {
          store.selectParameter(param);
          let variant = store.ui.getLayoutVariant("PARAMETER");
          store.ui.getPanel("MAIN").setLayout(variant);
          store.context.setContextmenu(); // removes menu
        }
      }
    });
  };

  const generateInterface = shader => {
    let controls = shader.uniforms.map(uniform => {
      return (
        <ControlGroupComponent key={uniform.name} name={uniform.name}>
          {uniform.elements.map((param, i) => {
            let input = null;
            let value = param.value;

            switch (param.uniform.type) {
              case "BOOL":
                input = (
                  <InputBool
                    key={i}
                    step={0.1}
                    value={value}
                    onChange={e => handleValueChange(param, e)}
                    focused={param === store.selectedParameter}
                    onDoubleClick={e => {
                      store.selectParameter(param);
                    }}
                    onContextMenu={e => handleParameterContextMenu(e, param)}
                  />
                );
                break;
              case "FLOAT":
                input = (
                  <InputFloat
                    key={i}
                    step={0.1}
                    value={value}
                    onChange={e => handleValueChange(param, e)}
                    focused={param === store.selectedParameter}
                    inputStyle={{
                      fontWeight: param.graph ? "bold" : "normal",
                      color: param.graph
                        ? theme.accent_color
                        : theme.text_color,
                      fontStyle: param.graph ? "italic" : "normal"
                      // textDecoration: param.graph ? 'underline' : 'none'
                    }}
                    onDoubleClick={e => {
                      store.selectParameter(param);
                    }}
                    onContextMenu={e => handleParameterContextMenu(e, param)}
                  />
                );
                break;
              case "INT":
                input = (
                  <InputFloat
                    key={i}
                    step={1}
                    value={value}
                    onChange={e => handleValueChange(param, Math.floor(e))}
                    focused={param === store.selectedParameter}
                    inputStyle={{
                      fontWeight: param.graph ? "bold" : "normal",
                      color: param.graph
                        ? theme.accent_color
                        : theme.text_color,
                      fontStyle: param.graph ? "italic" : "normal"
                      // textDecoration: param.graph ? 'underline' : 'none'
                    }}
                    onDoubleClick={e => {
                      store.selectParameter(param);
                    }}
                    onContextMenu={e => handleParameterContextMenu(e, param)}
                  />
                );
                break;
              case "SLIDER":
              // TODO
              // input = (
              //   <InputSlider
              //     key={i}
              //     step={1}
              //     min={0}
              //     max={100}
              //     value={value}
              //     onChange={e => handleValueChange(param, e)}
              //     focused={param === store.selectedParameter}
              //     // onDoubleClick={(e) => {
              //     // 	store.selectParameter(param);
              //     // }}
              //   />
              // );
              // break;
              case "COLOR":
              // TODO
              default:
                input = (
                  <InputFloat
                    key={i}
                    step={0.1}
                    value={value}
                    onChange={e => handleValueChange(param, e)}
                    focused={param === store.selectedParameter}
                    inputStyle={{
                      fontWeight: param.graph ? "bold" : "normal",
                      color: param.graph ? theme.accent_color : theme.text_color
                    }}
                    onDoubleClick={e => {
                      store.selectParameter(param);
                    }}
                    onContextMenu={e => handleParameterContextMenu(e, param)}
                  />
                );
                break;
            }

            return input;
          })}
        </ControlGroupComponent>
      );
    });

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
  
  props.data.queue.forEach(subqueue => {
    subqueue.forEach((node, i) => {
      let subpanels = [];
      let is_selected = props.selectedNode === node;

      if (node.data) {
        let controls = null;
        switch (node.data.name) {
          case "Webcam":
            controls = [
              <WebcamInputComponent key={node.uuid} ref={refs[i]} data={node} />
            ];
            break;
          case "Image":
            controls = [
              <ImageInputComponent key={node.uuid} ref={refs[i]} data={node} />
            ];
            break;
          case "Text":
            controls = [
              <TextInputComponent key={node.uuid} ref={refs[i]} data={node} />
            ];
            break;
          case "Sketch":
            controls = [
              <SketchInputComponent key={node.uuid} ref={refs[i]} data={node} />
            ];
            break;
          default:
            controls = generateInterface(node.data);
        }
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
                  onChange={(e) => {
                    e.preventDefault();
                    node.setBypass(!node.bypass);                  
                  }}
                />
              )}
              collapsible={controls.length ? true : false}
              titleStyle={{
                color: is_selected ? theme.text_color : theme.text_color,
                backgroundColor: is_selected
                  ? theme.accent_color
                  : theme.primary_color
              }}
              //expanded={(node === props.data.selectedNode) || expandAll}
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
    <GenericPanel
      panel={props.panel}
      onFocus={handleFocus}
      onBlur={handleBlur}
      toolbar={
        <ToolbarComponent
          items={{
            ToggleExpand: {
              id: "ToggleExpand",
              label: expandAll ? "Collapse" : "Expand",
              onClick: () => setExpandAll(!expandAll)
            }
          }}
        />
      }
    >
      {props.data.nodes && panels}
    </GenericPanel>
  );
});

export default ShaderControls;
