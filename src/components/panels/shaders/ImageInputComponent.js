import { observer } from "mobx-react";
import React, { useLayoutEffect, useRef, useContext } from "react";
import Dropzone from "react-dropzone";
import MainContext from "../../../MainContext";
import MediaSelector from "../reusables/MediaSelectorComponent";
import { getSnapshot, isAlive } from "mobx-state-tree";

import {
  ControlGroupComponent,
  InputSelect,
  InputFloat,
  TextComponent
} from "maco-ui";
import styles from "./ImageInputComponent.module.css";

const ImageInputComponent = observer(props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;
  const { data } = props.data;

  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param, v) => param.setValue(v);
  
  const handleMediaSelect = e => {
    console.log('selectedMedia', e)
    console.log('data to add to', getSnapshot(data))
//     instead of using dataURL, use mediaID
  }  

  return (
    <React.Fragment>
      <ControlGroupComponent name="Image File">
        <MediaSelector mediaType="image" onMediaSelect={handleMediaSelect} />
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

export default ImageInputComponent;
