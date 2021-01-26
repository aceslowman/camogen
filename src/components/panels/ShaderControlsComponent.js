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

const ShaderControls = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [useKeys, setUseKeys] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

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
                    style={{
                      //fontWeight: param.graph ? "bold" : "normal",
                      //color: param.graph
                      //  ? theme.accent_color
                      //  : theme.text_color,
                      //fontStyle: param.graph ? "italic" : "normal",
                      border: `1px solid ${theme.accent_color}`
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
              //     key={800i}
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
              // VEC2 and everything else like that ends up here, since 
              // they are assumed to be float. that doesn't account for
              // ivec but I'll look into that when it becomes an issue
              default:
                // console.log('PARAM', param.uniform.type)
                input = (
                  <InputFloat
                    key={i}
                    step={0.1}
                    value={value}
                    onChange={e => handleValueChange(param, e)}
                    focused={param === store.selectedParameter}
                    inputStyle={{
                      border: param === store.selectedParameter ? `1px solid ${theme.accent_color}` : 'none',
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
      <ControlsComponent 
        data={props.data} 
        generateInterface={generateInterface}
      />
    </GenericPanel>
  );
});

export default ShaderControls;
