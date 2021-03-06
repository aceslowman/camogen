import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef
} from "react";
import MainContext from "../../MainContext";
import styles from "./ShaderEditorComponent.module.css";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/keymap/sublime";
import "codemirror/mode/clike/clike";

import { GenericPanel, ToolbarComponent } from "maco-ui";

let editor;

// key={panel.id}
//         node={scene.shaderGraph.selectedNode}
//         data={scene.shaderGraph.selectedNode.data}
//         graph={scene.shaderGraph}
//         hasChanged={
//           scene.shaderGraph.selectedNode.data
//             ? scene.shaderGraph.selectedNode.data.hasChanged
//             : null
//         }
//         panel={panel}

const ShaderEditor = props => {
  const store = useContext(MainContext).store;
  const mainRef = useRef(null);
  const editorRef = useRef(null);
  const [editType, setEditType] = useState("vert");

  const graph = store.scene.shaderGraph;
  const node = graph.selectedNode;
  const data = node.data;
  const hasChanged = data ? data.hasChanged : null;

  const handleRefresh = () => {
    store.p5_instance.loop();
    data.init();
  };

  const handleEditorChange = (doc, changes) => {
    let value = doc.getValue();

    if (editType === "vert") {
      data.setVert(value);
    } else {
      data.setFrag(value);
    }
  };

  const showEditor = node !== undefined && data;

  const toolbar = (
    <ToolbarComponent
      style={{ zIndex: 6 }}
      items={
        showEditor
          ? {
              File: {
                id: "File",
                label: "File",
                dropDown: {
                  NameShader: {
                    id: "NameShader",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          flexFlow: "row"
                        }}
                      >
                        <label>name:</label>
                        <input
                          style={{
                            backgroundColor: "inherit",
                            color: "inherit",
                            border: "none",
                            width: "100%",
                            marginLeft: 4,
                            fontFamily: "inherit"
                          }}
                          type="text"
                          placeholder={data.name}
                          onChange={e => {
                            node.data.setName(e.target.value);
                          }}
                          onFocus={e => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    )
                  },
                  SaveShader: {
                    id: "SaveShader",
                    label: "Save Shader",
                    onClick: () => data.save()
                  },
                  SaveCollection: {
                    id: "SaveCollection",
                    label: "Save to Collection",
                    onClick: () => {
                      data.saveToCollection();
                      store.persistShaderCollection();
                    }
                  },
                  LoadShader: {
                    id: "LoadShader",
                    label: "Load Shader",
                    onClick: () => data.load()
                  },
                  NewShader: {
                    id: "NewShader",
                    label: "New Shader",
                    onClick: () => graph.setSelectedByName("Thru")
                  }
                }
              },
              Vertex: {
                id: "Vertex",
                label: "Vertex",
                onClick: () => setEditType("vert"),
                highlight: editType === "vert"
              },
              Fragment: {
                id: "Fragment",
                label: "Fragment",
                onClick: () => setEditType("frag"),
                highlight: editType === "frag"
              },
              Refresh: {
                id: "Refresh",
                label: "↻ Refresh",
                onClick: () => handleRefresh()
              }
            }
          : {
              NewShaderEmpty: {
                id: "NewShaderEmpty",
                label: "New Shader",
                onClick: () => graph.setSelectedByName("Thru")
              }
            }
      }
    />
  );

  // when the component mounts, setup CodeMirror
  useLayoutEffect(() => {
    editor = CodeMirror(editorRef.current, {
      mode: "x-shader/x-fragment",
      theme: "monokai",
      lineNumbers: true,
      foldGutter: true,
      keymap: "sublime"
    });

    editor.getDoc().on("change", handleEditorChange);
  }, []);

  // changes editor display depending on what mode is selected
  useLayoutEffect(() => {
    let doc;

    if (data) {
      doc = CodeMirror.Doc(
        editType === "frag" ? data.frag : data.vert,
        "x-shader/x-fragment"
      );
      editor.swapDoc(doc);
    } else {
      doc = CodeMirror.Doc("no shader selected!");
      editor.swapDoc(doc);
    }

    // do I need to remove listener?
    doc.on("change", handleEditorChange);
  }, [editType, data]);

  return (
    <GenericPanel
      panel={props.panel}
      subtitle={
        <span
          style={{
            fontStyle: hasChanged ? "italic" : "normal"
          }}
        >
          {hasChanged ? "unsaved" : ""}
        </span>
      }
      toolbar={toolbar}
      onFocus={e => editor.focus()}
    >
      <div className={styles.editor} ref={editorRef}></div>
    </GenericPanel>
  );
};

export default ShaderEditor;
