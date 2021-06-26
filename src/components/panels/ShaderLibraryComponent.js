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

  let files = [];
  let directories = [];
  
  const handleClick = (item) => {
    console.log('item',item)
  }

  store.shader_collection.traverse(e => {
    // console.log('e', getSnapshot(e))
    let path = e.path.split("/").slice(1);
    // ["app", "shaders", "Math", "Subtract"]
    let distance_from_root = path.length - 2;

    if(e.type === "directory") {
      let children = [];
        e.children.forEach((c, i) => {
          if (c.type === "file") children.push((
            <li key={c.id}>
              <button onClick={()=>handleClick(c)}>{c.name}</button>
            </li>));
        });

        directories.push(
          <React.Fragment>
            <h3>{e.name}</h3>
            <ul>{children}</ul>
          </React.Fragment>
        );
    }
  }, true);

  // console.log(getSnapshot(store.shader_collection.children))

  // store.shader_collection.children.forEach((e,i) => {
  //   console.log(e.name)
  // });

  return <GenericPanel panel={props.panel}>{directories}</GenericPanel>;
});

export default ShaderLibrary;
