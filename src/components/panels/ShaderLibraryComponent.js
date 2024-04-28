import React, {
  useContext,
  useLayoutEffect,
  useState
} from "react";
import MainContext from "../../MainContext";
import { observer } from "mobx-react";
import * as style from "./ShaderLibraryComponent.module.css";
import { GenericPanel } from "../../ui";

const ShaderLibrary = props => {
  const store = useContext(MainContext).store;
  const theme = store.ui.theme;

  let directories = [];

  const [tree, setTree] = useState([]);
  const [currentlyRenaming, setCurrentlyRenaming] = useState();

  const handleClick = item => {
    setCurrentlyRenaming(undefined);
    store.scene.shaderGraph.setSelectedByName(item.name, item);
  };

  const handleDeleteItem = (event, e, c) => {
    if (c.name === "UV") {
      alert("You can't delete the UV shader!")
    } else {
      let conf = confirm("are you sure you want to delete this shader? You can always back up and restore your shader library by using the Library menu in the toolbar.")

      if (conf) {
        event.preventDefault();
        event.stopPropagation();
        e.removeChild(c);
      }
    }
  }

  const handleAddNewShader = collection => {
    let newShader = collection.addChild();
    store.scene.shaderGraph.setSelectedByName(newShader.name, newShader);
  };

  const handleAddNewCollection = () => {
    /* for now this will only be on the base level */
    store.shader_collection.addChild(undefined, "directory");
  };

  const handleRenameItem = item => {
    if (item.name === "UV") {
      alert("You cant rename the UV shader!")
    } else {
      if (item.data) item.data.saveToLocalStorage()
      setCurrentlyRenaming(item);
    }
  };

  const handleRenameInput = (e, c) => {
      let res = currentlyRenaming.setName(e.target.value)
      if (!res) setCurrentlyRenaming(undefined);
  }

  useLayoutEffect(() => {
    store.shader_collection.traverse(e => {
      // this temporarily removes the top level from the tree
      if (e.path === "/app/shaders") return;

      let path = e.path.split("/").slice(1);
      let distance_from_root = path.length - 2;

      if (e.type === "directory") {
        let children = [];

        e.children.forEach((c, i) => {
          if (c.type === "file") {
            if (currentlyRenaming && c.id === currentlyRenaming.id) {
              children.push(
                <li key={c.id}>
                  <input
                    autoFocus={true}
                    style={{
                      backgroundColor: theme.secondary_color,
                      color: theme.text_color
                    }}
                    placeholder={"renaming " + c.name}
                    onKeyDown={e => {
                      if(e.key === 'Enter') {
                        handleRenameInput(e, c)
                        e.currentTarget.blur()
                        // allows for node in shader graph to be replaced
                        handleClick(c)
                      }
                    }}          
                  />
                </li>
              );
            } else {
              children.push(
                <li style={{ display: "flex" }} key={c.id}>
                  <button
                    style={{
                      backgroundColor: theme.secondary_color,
                      color: theme.text_color,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                    className={
                      c.name === store.scene.shaderGraph.selectedNode.name ? style.activeButton : ""
                    }
                    onClick={() => handleClick(c)}
                    onDoubleClick={() => handleRenameItem(c)}
                    onContextMenu={_e => handleContextMenu(_e, e, c)}
                    dataid={c.id}
                  >
                    {c.name}{c.data ? (c.data.hasChanged ? '*' : '') : ''}
                    <a onClick={event => handleDeleteItem(event, e, c)}>
                      x
                    </a>
                  </button>
                </li>
              );
            }
          }
        });

        directories.push(
          <div key={e.id}>
            {currentlyRenaming && e.id === currentlyRenaming.id ? (
              <input
                style={{
                  backgroundColor: theme.secondary_color,
                  color: theme.text_color
                }}
                placeholder={"renaming " + e.name}
                onChange={_e => handleRenameInput(_e, e)}
              />
            ) : (
              <button
                style={{
                  backgroundColor: theme.secondary_color,
                  color: theme.text_color
                }}
                onClick={() => handleClick(e)}
                onDoubleClick={() => handleRenameItem(e)}
                dataid={e.id}
              >
                <h3>{e.name} {e.data ? e.data.hasChanged : ''}</h3>
              </button>
            )}

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
    store.scene.shaderGraph.selectedNode,
    store.shader_collection.updateFlag,
    store.updateFlag,
    currentlyRenaming,
  ]);

  const handleContextMenu = (e, collection, child) => {
    e.stopPropagation();

    if (!child) {
      store.ui.context.setContextmenu({});
    } else {
      // select on right click
      handleClick(child);

      store.ui.context.setContextmenu({
        Delete: {
          id: "Delete",
          label: "Delete",
          onClick: () => {
            collection.removeChild(child);
            store.ui.context.setContextmenu({});
          }
        }
      });
    }
  };

  return (
    <GenericPanel
      showTitle={false}
      panel={props.panel}
      onContextMenu={handleContextMenu}
    //onFocus={handleFocus}
    //onBlur={handleBlur}
    >
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
    </GenericPanel>
  );
};

export default observer(ShaderLibrary);
