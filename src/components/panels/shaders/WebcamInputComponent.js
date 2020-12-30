import { observer } from "mobx-react";
import React, { useContext } from "react";
import { ControlGroupComponent, InputSelect, InputFloat } from "maco-ui";
import styles from "./WebcamInputComponent.module.css";
import MainContext from "../../../MainContext";

const WebcamInputComponent = observer(props => {
  const { data } = props.data;
  const store = useContext(MainContext).store;
  const { theme } = store.ui;

  let pan = data.getUniform("pan");

  const handleInputSelect = e => data.setInput(e);
  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param, v) => param.setValue(v);

  return (
    <React.Fragment>
      <ControlGroupComponent name="Input Device">
        <InputSelect
          options={props.data.data.input_options.map(e => ({
            label: e.label,
            value: e.deviceId
          }))}
          onChange={handleInputSelect}
        />
        <div 
          className={styles.refresh}
          style={{
            backgroundColor: theme.secondary_color,
            border: theme.outline_color,
            color: theme.text_color
          }}
        >
          <button
            onClick={() => {
              console.log("refreshing inputs");
              data.refresh();
            }}
          >
            ↻
          </button>
        </div>
      </ControlGroupComponent>
      <ControlGroupComponent name="Display Mode">
        <InputSelect
          options={[
            { label: "fit vertical", value: "fit_vertical" },
            { label: "fit horizontal", value: "fit_horizontal" },
            { label: "stretch", value: "stretch" }
          ]}
          onChange={handleDisplayMode}
        />
      </ControlGroupComponent>
      <ControlGroupComponent name="Pan">
        {data.getUniform("pan").elements.map((e, i) => (
          <InputFloat
            key={e.uuid}
            value={e.value}
            onChange={v => handlePan(e, v)}
          />
        ))}
      </ControlGroupComponent>
    </React.Fragment>
  );
});

export default WebcamInputComponent;
