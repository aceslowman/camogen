import React, { useContext, useState } from "react";
import Dropzone from "react-dropzone";
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
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <TextComponent>
            <h3>the following assets can't be found</h3>
          </TextComponent>
          <ul>
            {store.missingAssets.map((e, i) => {
              return <li>{e.user_filename}</li>;
            })}
          </ul>
        </div>
        <div className={styles.dropzone} style={{ padding: '15px' }}>
          <Dropzone
            onDrop={e => console.log("dropped", e)}            
          >
            {({ getRootProps, getInputProps }) => (
              <section style={{ border: "1px dotted white", height: "100%" }}>
                <div {...getRootProps({style:{ height: "100%", padding: 15 }})}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
    </PanelComponent>
  );
});

export default MissingAssets;
