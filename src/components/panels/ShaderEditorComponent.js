import React, { useState, useEffect, useContext, useRef } from "react";
import MainContext from "../../MainContext";
import styles from "./ShaderEditorComponent.module.css";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/keymap/sublime";

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

  const handleEditorChange = e => {
    switch (editType) {
      case "vert":
        props.data.setVert(e);
        break;
      case "frag":
        props.data.setFrag(e);
        break;
      default:
        break;
    }
  };

  const showEditor = props.node !== undefined && props.data;

  const toolbar = (
    <ToolbarComponent
      items={
        showEditor
          ? [
              {
                label: "Save Shader",
                onClick: () => props.data.save()
              },
              {
                label: "Vertex",
                onClick: () => setEditType("vert"),
                highlight: editType === "vert"
              },
              {
                label: "Fragment",
                onClick: () => setEditType("frag"),
                highlight: editType === "frag"
              },
              {
                label: "Refresh",
                onClick: () => handleRefresh()
              }
            ]
          : [
              {
                label: "New Shader",
                onClick: () => props.graph.setSelectedByName("Default")
              },
              {
                label: "Load Shader",
                onClick: () => {
                  props.data.load();
                }
              }
            ]
      }
    />
  );
 
  useEffect(() => {
    console.log("mounting editor");
    editor = CodeMirror(editorRef.current, {
      value: editType === "frag" ? props.data.frag : props.data.vert,
      mode: "clike",
      theme: "monokai",
      lineNumbers: true,
      foldGutter: true,
      keymap: "sublime",
      mode: "clike",
      theme: "monokai",
      // autofocus: true
      inputStyle: "contenteditable"
    });
    
    editor.onchange = handleEditorChange;
  }, []);
  
  useEffect(() => {
    let doc = CodeMirror.Doc(
      editType === "frag" ? props.data.frag : props.data.vert,
      "clike"
    );
    editor.swapDoc(doc)
  }, [editType])

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
    >
      {/*showEditor && (
        <CodeMirror
          className={styles.editor}
          value={editType === "frag" ? props.data.frag : props.data.vert}
          onChange={handleEditorChange}
          options={{
            lineNumbers: true,
            foldGutter: true,
            keymap: "sublime",
            mode: "clike",
            theme: "monokai"
          }}
        />{
      )*/}

      {showEditor && (
        <div 
          className={styles.editor} 
          ref={editorRef}
          onFocus={(e)=>{
            e.preventDefault();
            editor.focus();
            console.log('focusing!')
          }}
          onBlur={(e) => {
            
            console.log('blur!', e.relatedTarget)
          }}
        ></div>
      )}

      {!showEditor && (
        <p className={styles.no_node_selected}>
          <em> no shader node selected</em>
          <br />
          <br />
        </p>
      )}
    </GenericPanel>
  );
};

export default ShaderEditor;
