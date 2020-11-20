import React, { useContext, useState } from "react";
import { InputSelect, ThemeContext, PanelComponent } from "maco-ui";
import styles from "./AboutOverlayComponent.module.css";
import MainContext from "../../MainContext";
import { observer } from "mobx-react";

const AboutOverlay = observer(() => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  
  const [position, setPosition] = useState([50,50]);
  const [dimensions, setDimensions] = useState([500,500]);

  const handlePosition = (e) => {
    setPosition(e)
  }
  
  const handleDimensions = (e) => {
    console.log(e9)
    setDimensions(dimensions)
  }
  
  return (
    <PanelComponent 
      position={position}
      dimensions={dimensions}
      onPositionChange={handlePosition}
      onDimensionsChange={handleDimensions}
      className={styles.wrapper} 
      floating={true}
    >
      <h1>
        camogen <sub>v0.1.0</sub>
      </h1>

      <p>created by austin slominski</p>
      <small>@aceslowman</small>
    </PanelComponent>
  );
});

export default AboutOverlay;
