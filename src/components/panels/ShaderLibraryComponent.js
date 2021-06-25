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
  
  // TODO: working on making assinging collections more straightforward
  let collections = {};

  store.shader_collection.children.forEach((e, i) => {
    
    // console.log("E", e);
    if (e.children) {
      collections = {
        ...collections,
        [e.name]: {
          label: e.name,
          // onClick: () => handleSaveToCollection(e)
        }
      };
    }
  });

  console.log("COLLECTIONS", collections);
  
  store.shader_collection.traverse(e => {
    console.log('e', getSnapshot(e))
    
    items.push((<div>{e.name}</div>))
  })

  return (
    <GenericPanel panel={props.panel}>
      {items}
    </GenericPanel>
  );
});

export default ShaderLibrary;
