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

  store.shader_collection.traverse(e => {
    console.log('e', getSnapshot(e))
    /* 
      there are a lot of overlaps between the graph
      system and the collection system and they should 
      probably be collapsed into one
      
      for the time being, I'm using the path string
      (ie "/app/shaders/Math/Subtract") to get the distance
      between the current item add to the root
    */
    let distance_to_trunk = e.path
    items.push((<div key={e.id}>{e.name}</div>))
  })

  return (
    <GenericPanel panel={props.panel}>
      {items}
    </GenericPanel>
  );
});

export default ShaderLibrary;
