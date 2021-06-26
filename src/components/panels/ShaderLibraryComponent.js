import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel, TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./ShaderLibraryComponent.module.css";
import { ThemeContext, SplitContainer } from "maco-ui";
import Dropzone from "react-dropzone";
import filesize from "file-size";

const ShaderLibrary = observer(props => {
  const theme = useContext(ThemeContext);
  const store = useContext(MainContext).store;
  const data = store.mediaLibrary;
  
  let items = [];
  let directory = [];

  store.shader_collection.traverse((e,distance_from_root) => {
    
    // console.log('e', getSnapshot(e))
    
    
    
    
    switch(e.type) {
      case 'file':
        // items.push((<div key={e.id}>{e.name}</div>))
        console.log('file', getSnapshot(e))
        break;
      case 'directory':
        console.log('directory', getSnapshot(e))        
        break;
      default:
        break;
    }
    
    
  }, true)

  return (
    <GenericPanel panel={props.panel}>
      {items}
    </GenericPanel>
  );
});

export default ShaderLibrary;
