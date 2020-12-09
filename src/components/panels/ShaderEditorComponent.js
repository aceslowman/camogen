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

const ShaderEditor = props => {
  const store = useContext(MainContext).store;
  const mainRef = useRef(null);
  const editorRef = useRef(null);
  const [editType, setEditType] = useState("vert");

  const handleRefresh = () => {
    store.p5_instance.loop();
    props.data.init();
  };

  const handleEditorChange = (doc, changes) => {
    let value = doc.getValue();
    
    if(editType === "vert") {      
      props.data.setVert(value);
    } else {
      props.data.setFrag(value);
    }
  };

  const showEditor = props.node !== undefined && props.data;

  const toolbar = (
    <ToolbarComponent
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
                          placeholder={props.data.name}
                          onChange={e => {
                            props.node.data.setName(e.target.value);
                          }}
                          onFocus={e => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    )
                  },
                  "Save Shader": {
                    id: "Save Shader",
                    label: "Save Shader",
                    onClick: () => props.data.save()
                  },
                  "Load Shader": {
                    id: "Load Shader",
                    label: "Load Shader",
                    onClick: () => props.data.load()
                  },
                  "New Shader": {
                    id: "New Shader",
                    label: "New Shader",
                    onClick: () => props.data.clear()
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
                label: "Refresh",
                onClick: () => handleRefresh()
              }
            }
          : {
              NewShader: {
                id: "NewShader",
                label: "New Shader",
                onClick: () => props.graph.setSelectedByName("Default")
              }
            }
      }
    />
  );

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

  useLayoutEffect(() => {
    let doc;

    if (props.data) {
      doc = CodeMirror.Doc(
        editType === "frag" ? props.data.frag : props.data.vert,
        "x-shader/x-fragment"
      );
      editor.swapDoc(doc);
    } else {
      doc = CodeMirror.Doc("no shader selected!");
      editor.swapDoc(doc);
    }

    // do I need to remove listener?
    doc.on("change", handleEditorChange);
  }, [editType, props.data]);

  return (
    <GenericPanel
      panel={props.panel}
      subtitle={
        <span
          style={{
            fontStyle: props.hasChanged ? "italic" : "normal"
          }}
        >
          {props.hasChanged ? "unsaved" : ""}
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
