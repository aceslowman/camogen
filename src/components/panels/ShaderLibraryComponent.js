bimport React, { useContext, useEffect, useState, useRef } from "react";
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

  const handleClick = item => {
    console.log("item", item);
  };

  console.log(getSnapshot(store.shader_collection));

  store.shader_collection.traverse(e => {
    // this temporarily removes the top level from the tree
    if (e.path === "/app/shaders") return;

    // console.log('e', getSnapshot(e))
    let path = e.path.split("/").slice(1);
    // ["app", "shaders", "Math", "Subtract"]
    let distance_from_root = path.length - 2;

    if (e.type === "directory") {
      let children = [];
      e.children.forEach((c, i) => {
        if (c.type === "file")
          children.push(
            <li key={c.id}>
              <button
                style={{
                  backgroundColor: theme.secondary_color,
                  color: theme.text_color
                }}
                onClick={() => handleClick(c)}
              >
                {c.name}
              </button>
            </li>
          );
      });

      directories.push(
        <div key={e.id}>
          {/* this name should be editable */}
          <button
            style={{
              backgroundColor: theme.secondary_color,
              color: theme.text_color
            }}
            onClick={() => handleClick(e)}
          >
            <h3>{e.name}</h3>
          </button>
          <ul>
            {children}
                             NewShader: {
                  id: "NewShader",
                  label: "+ New Shader",
                  onClick: () => {
                    // create short random string for new shader name
                    let new_shader = Shader.create({ name: nanoid(5) });

                    e.addChild(
                      Collection.create({
                        id: new_shader.name,
                        name: new_shader.name,
                        type: "file",
                        data: new_shader
                      })
                    );

                    self.persistShaderCollection();
                  }
                }
          </ul>
        </div>
      );
    }
  }, true);

  // console.log(getSnapshot(store.shader_collection.children))

  // store.shader_collection.children.forEach((e,i) => {
  //   console.log(e.name)
  // });

  return (
    <GenericPanel panel={props.panel}>
      <div className={style.wrapper}>{directories}</div>
    </GenericPanel>
  );
});

export default ShaderLibrary;
