import React, { useContext, useState } from "react";
import Dropzone from 'react-dropzone'
import {
  InputSelect,
  InputBool,
  ThemeContext,
  PanelComponent,
  TextComponent
} from "maco-ui";
import styles from "./MissingAssetsComponent.module.css";
import MainContext from "../MainContext";
import { observer } from "mobx-react";

const MissingAssets = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;

  const [position, setPosition] = useState([
    window.innerWidth / 2 - 312,
    window.innerHeight / 2 - 212
  ]);
  const [dimensions, setDimensions] = useState([625, 425]);

  const handlePosition = setPosition;

  const handleDimensions = setDimensions;

  return (
    <PanelComponent
      position={position}
      dimensions={dimensions}
      onPositionChange={handlePosition}
      onDimensionsChange={handleDimensions}
      className={styles.wrapper}
      floating={true}
      title="Missing Assets"
      showTitle={true}
      style={{
        backgroundColor: theme.primary_color,
        color: theme.text_color
      }}
      canRemove={true}
      onRemove={props.onRemove}
      style={{
        zIndex: 1000,
        borderColor: "red"
      }}
    >
      <div>
        <ul>
          {store.missingAssets.map((e, i) => {
            return <li>{e.user_filename}</li>;
          })}
        </ul>
      </div>
      <div>
        <Dropzone onDrop={(e) => console.log('dropped',e)}>
        </Dropzone>
      </div>
    </PanelComponent>
  );
});

export default MissingAssets;
