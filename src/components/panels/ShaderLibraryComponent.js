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

  store.shader_collection.traverse(e => {
    // console.log('e', getSnapshot(e))
    let path = e.path.split("/").slice(1);
    // ["app", "shaders", "Math", "Subtract"]
    let distance_from_root = path.length - 2;

    switch (e.type) {
      case "file":
        // files.push((<div key={e.id}>{e.name}</div>))
        console.log("file", e.name);
        break;
      case "directory":
        console.log("directory", e.name);
        // items.push((<div key={e.id}>{e.name}</div>))
        e.children.forEach((c, i) => {
          console.log('needing to add',c.name);
          files.push((<div key={e.id}>{e.name}</div>))
        });
        break;
      default:
        break;
    }
  }, true);

  // console.log(getSnapshot(store.shader_collection.children))

  // store.shader_collection.children.forEach((e,i) => {
  //   console.log(e.name)
  // });

  return <GenericPanel panel={props.panel}>{directories}</GenericPanel>;
});

export default ShaderLibrary;
