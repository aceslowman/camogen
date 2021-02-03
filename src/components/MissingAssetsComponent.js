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
  
  const handleDrop = files => {
    console.log("dropped", files);
    files.forEach((e,i) => {
      console.log('e', e)
      
      store.missingAssets.forEach((j) => {
        console.log('j', j)
        if(e.name === j.name) console.log('hit')
      })
      
    })
  }

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
        // borderColor: "red"
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <TextComponent>
            <h3>the following assets can't be found</h3>
            <ul>
              {store.missingAssets.map((e, i) => {
                return <li>{e.user_filename}</li>;
              })}
            </ul>
          </TextComponent>
        </div>
        <div className={styles.dropzone} style={{ padding: "15px" }}>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section style={{ border: "1px dotted white", height: "100%" }}>
                <div
                  {...getRootProps({
                    style: {
                      height: "100%",
                      padding: "15px",
                      display: "flex",
                      alignItems: "center"
                    }
                  })}
                >
                  <input {...getInputProps()} />
                  <TextComponent>
                    <p>select the missing images and drop them here.</p>
                    <p>
                      you can also create a folder of them and drop them in all
                      at once.
                    </p>
                  </TextComponent>
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
