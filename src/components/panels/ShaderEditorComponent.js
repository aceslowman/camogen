import React, {
  useState,
  useLayoutEffect,
  useContext,
  useRef
} from "react";
import MainContext from "../../MainContext";
import * as styles from "./ShaderEditorComponent.module.css";
import { observer } from "mobx-react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/keymap/sublime";
import "codemirror/mode/clike/clike";

import { GenericPanel, ToolbarComponent } from "../../ui";

let editor;

const ShaderEditor = props => {
  const store = useContext(MainContext).store;
  const editorRef = useRef(null);
  const [editType, setEditType] = useState("vert");

  const graph = store.scene.shaderGraph;
  const node = graph.selectedNode;
  const data = node ? node.data : null;
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

  const handleSaveToFile = () => {
    data.saveToFile();
  };

  const handleSave = (shaderNode) => {
    shaderNode.data.saveToLocalStorage()
  }

  const showEditor = node !== undefined && data;

  const toolbar = (
    <ToolbarComponent
      //style={{ zIndex: 1 }}
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
                SaveToShader: {
                  id: "SaveToShader",
                  label: "Save to File",
                  onClick: () => handleSaveToFile()
                },
                Save: {
                  id: "Save",
                  label: "Save",
                  onClick: () => handleSave(node),
                },
                LoadShader: {
                  id: "LoadShader",
                  label: "Load Shader",
                  onClick: () => data.load()
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
            },
            HasRecentlyChanged: {
              id: "HasRecentlyChanged",
              label: (<span
                style={{
                  fontStyle: hasChanged ? "italic" : "normal",
                  color: hasChanged ? "red" : store.ui.theme.text_color
                }}
              >
                {hasChanged ? "✗ unsaved" : "✓ saved"}
              </span>),
              onClick: () => handleSave(node)
            },

          }
          : {}
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
      doc = CodeMirror.Doc("no shader selected! \n\nuse the shader library panel \nor the library menu at the top \nto add and remove shaders");
      editor.swapDoc(doc);
    }

    // do I need to remove listener?
    doc.on("change", handleEditorChange);
  }, [editType, data]);

  console.log(node)
  return (
    <GenericPanel
      showTitle={false}
      panel={props.panel}
      toolbar={toolbar}
      onFocus={e => editor.focus()}
      styles={{width:'100%'}}
    >
      <div className={styles.editor} ref={editorRef}></div>
    </GenericPanel>
  );
};

export default observer(ShaderEditor);
