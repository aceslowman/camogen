import React, { useContext } from "react";
import MainContext from "../../MainContext";
import {
  PanelComponent,
  GenericPanel,
  ControlGroupComponent,
  InputBool,
  InputFloat,
  ThemeContext
} from "maco-ui";
import uuidv1 from "uuid/v1";

import styles from "./ShaderControlsComponent.module.css";
import { observer } from "mobx-react";
import { branch_colors } from "../../stores/GraphStore";
import WebcamComponent from "./shaders/WebcamComponent";
import ImageInputComponent from "./shaders/ImageInputComponent";

const ShaderControls = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const handleValueChange = (param, e) => {
    param.setValue(e);
  };

  const handleParameterContextMenu = (e, param) => {
    // TODO: adding onContextMenu to inputs
    e.stopPropagation();
    e.preventDefault();

    store.context.setContextmenu([
      {
        label: "Edit Parameter",
        onClick: () => {
          store.selectParameter(param);
          // store.layout.addPanel({
          //   id: uuidv1(),
          //   title: "Edit Param",
          //   type: "PARAMETER_EDITOR",
          //   floating: true,
          //   canFloat: false,
          //   canRemove: true,
          //   collapsible: true,
          //   defaultWidth: 250,
          //   defaultHeight: 250,
          //   dimensions: [300, 400],
          //   position: [
          //     window.innerWidth / 2 - 150,
          //     window.innerHeight / 2 - 200
          //   ]
          // });
          console.log(store)
          store.layout.setLayout("PARAMETER")
          store.context.setContextmenu();
        }
      }
    ]);
  };

  const generateInterface = shader => {
    let controls = shader.uniforms.map(uniform => {
      return (
        <ControlGroupComponent key={uniform.name} name={uniform.name}>
          {uniform.elements.map((param, i) => {
            let input = null;
            let value = param.value;

            switch (value.constructor) {
              case Boolean:
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
              case Number:
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
            // TODO: all should rely on controlType
            // switch (param.controlType) {
            // 	case "slider":
            // 		input = (<InputSlider
            // 			key={i}
            // 			step={1}
            // 			min={0}
            // 			max={100}
            // 			value={value}
            // 			onChange={(e) => handleValueChange(param,e)}
            // 			focused={param === store.selectedParameter}
            // 			// onDoubleClick={(e) => {
            // 			// 	store.selectParameter(param);
            // 			// }}
            // 		/>);
            // 		break;

            // 	default:
            // 		break;
            // }

            return input;
          })}
        </ControlGroupComponent>
      );
    });

    return controls;
  };

  const panels = [];

  props.data.queue.forEach(subqueue => {
    subqueue.forEach((node, i) => {
      let subpanels = [];
      let is_selected = props.selectedNode === node;

      if (node.data) {
        let controls = null;

        switch (node.data.name) {
          case "Webcam":
            console.log("node data", node.data);
            controls = [
              <WebcamComponent
                key={node.uuid}
                onInputSelect={node.data.setInput}
                onChangeDisplayMode={node.data.setDisplayMode}
                input_options={node.data.input_options}
              />
            ];
            break;
          case "Image":
            controls = [<ImageInputComponent key={node.uuid} />];
            break;
          default:
            controls = generateInterface(node.data);
        }

        subpanels.push(
          <li
            key={i}
            style={{
              borderLeft: `3px solid ${branch_colors[node.branch_index]}`
            }}
          >
            <PanelComponent
              key={i}
              title={node.data.name}
              collapsible={controls.length ? true : false}
              titleStyle={{
                color: is_selected ? theme.text_color : theme.text_color,
                backgroundColor: is_selected
                  ? theme.accent_color
                  : theme.primary_color
              }}
              expanded={node === props.data.selectedNode}
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

  return (
    <GenericPanel panel={props.panel}>
      {props.data.nodes && panels}
    </GenericPanel>
  );
});

export default ShaderControls;
