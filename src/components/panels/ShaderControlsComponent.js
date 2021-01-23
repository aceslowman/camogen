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
import ControlsComponent from "../controls/ControlsComponent";

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
      {/*props.data.nodes && panels*/}
      <ControlsComponent 
        data={props.data}  
        selectedNode={props.selectedNode}
        generateInterface={generateInterface}
      />
    </GenericPanel>
  );
});

export default ShaderControls;
