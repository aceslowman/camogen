import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef
} from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { TextComponent } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import style from "./ShaderLibraryComponent.module.css";
import { UIContext, SplitContainer } from "maco-ui";
import Dropzone from "react-dropzone";
import filesize from "file-size";

const ShaderLibrary = observer(props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;
  const data = store.mediaLibrary;

  let files = [];
  let directories = [];

  const [tree, setTree] = useState([]);
  const [currentlyRenaming, setCurrentlyRenaming] = useState();

  const handleClick = item => {
    setCurrentlyRenaming(undefined);
    store.selectShader(item);
  };

  const handleAddNewShader = collection => {
    collection.addChild();
  };

  const handleAddNewCollection = () => {
    /* for now this will only be on the base level */
    store.shader_collection.addChild(undefined, "directory");
  };

  const handleRenameItem = item => {
    setCurrentlyRenaming(item.id);
  };

  useLayoutEffect(() => {
    store.shader_collection.traverse(e => {
      // this temporarily removes the top level from the tree
      if (e.path === "/app/shaders") return;

      // TODO paths should be calculated in collection store
      // ["app", "shaders", "Math", "Subtract"]
      let path = e.path.split("/").slice(1);
      let distance_from_root = path.length - 2;

      if (e.type === "directory") {
        let children = [];

        e.children.forEach((c, i) => {
          if (c.type === "file") {
            if (c.id === currentlyRenaming) {
              children.push(
                <li key={c.id}>
                  <input
                    style={{
                      backgroundColor: theme.secondary_color,
                      color: theme.text_color
                    }}
                    placeholder={"renaming " + c.name}
                    onChange={_e => c.setName(_e.target.value)}
                  />
                </li>
              );
            } else {
              children.push(
                <li key={c.id}>
                  <button
                    style={{
                      backgroundColor: theme.secondary_color,
                      color: theme.text_color
                    }}
                    className={
                      c === store.selectedShader ? style.activeButton : ""
                    }
                    onClick={() => handleClick(c)}
                    onDoubleClick={() => handleRenameItem(c)}
                  >
                    {c.name}
                  </button>
                </li>
              );
            }
          }
        });

        directories.push(
          <div key={e.id}>
            {/* this name should be editable on double-click */}
            <button
              style={{
                backgroundColor: theme.secondary_color,
                color: theme.text_color
              }}
              onClick={() => handleClick(e)}
              onDoubleClick={() => handleRenameItem(e)}
            >
              <h3>{e.name}</h3>
            </button>
            <ul>
              {children}
              <li>
                <button onClick={() => handleAddNewShader(e)}>
                  + New Shader
                </button>
              </li>
            </ul>
          </div>
        );
      }
    }, true);

    setTree(directories);
  }, [
    store.shader_collection,
    store.selectedShader,
    store.shader_collection.updateFlag,
    currentlyRenaming
  ]);

  return (
    <div className={style.wrapper}>
      {tree}
      <div>
        <button
          style={{
            backgroundColor: theme.secondary_color,
            color: theme.text_color
          }}
          onClick={() => handleAddNewCollection()}
        >
          <h3>+ New Collection</h3>
        </button>
      </div>
    </div>
  );
});

export default ShaderLibrary;