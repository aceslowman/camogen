import React, { useContext, useState } from "react";
import Dropzone from "react-dropzone";
import { getSnapshot } from "mobx-state-tree";
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
  const [matches, setMatches] = useState([]);

  const handlePosition = setPosition;

  const handleDimensions = setDimensions;

  const handleDrop = files => {
    files.forEach((file, i) => {
      store.missingAssets.forEach(asset => {
        if (file.name === asset.user_filename) {
          if (matches.indexOf(asset.user_filename) < 0)
            setMatches(prevMatches => [...prevMatches, asset.user_filename]);

          var reader = new FileReader();

          reader.onload = e => {
            // var image = document.createElement("img");
            asset.setAsset(e.target.result);
            asset.setUserFilename(file.name);
          };

          reader.readAsDataURL(file);
        }
      });
    });

    console.log("MATCHES", matches);
  };

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
        zIndex: 101
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <TextComponent>
            <h3>the following assets can't be found</h3>
            <ul>
              {store.missingAssets.map((e, i) => {
                return (
                  <li
                    key={e.user_filename}
                    style={{
                      color: "red",
                      textDecoration: // line-through when asset has been found
                        matches.indexOf(e.user_filename) !== -1
                          ? "line-through"
                          : "none"
                    }}
                  >
                    {e.user_filename}
                  </li>
                );
              })}
            </ul>
          </TextComponent>
          <TextComponent>
            <h3>matches:</h3>
            <ul>
              {matches.map((e, i) => {
                return (
                  <li key={e} style={{ color: "green" }}>
                    {e}
                  </li>
                );
              })}
            </ul>
          </TextComponent>
        </div>
        <div className={styles.dropzone} style={{ padding: "15px" }}>
          <Dropzone onDrop={e => handleDrop(e)}>
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
