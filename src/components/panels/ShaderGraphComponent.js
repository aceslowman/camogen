import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel } from "maco-ui";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";

const ShaderGraph = observer(props => {
  const store = useContext(MainContext).store;
  const { clipboard } = props.data;
  const [useKeys, setUseKeys] = useState(false);
  const mainRef = useRef();

  const handleFocus = e => setUseKeys(true);

  const handleBlur = e => setUseKeys(false);

  useEffect(() => {
    if (useKeys) {
      store.context.setKeymap({
        // redo
        "$mod+KeyZ": () => {
          if (props.data.history.canUndo) {
            console.log("UNDO", getSnapshot(props.data.history));
            props.data.history.undo();
            props.data.update();
            props.data.afterUpdate();
          } else {
            console.log("all out of undo");
          }
        },        
        // undo
        "$mod+Shift+KeyZ": () => {
          if (props.data.history.canRedo) {
            console.log("REDO", getSnapshot(props.data.history));
            props.data.history.redo();
            props.data.update();
            props.data.afterUpdate();
          } else {
            console.log("all out of redo");
          }
        },
        // bypass
        b: () => {          
          props.selectedNode.toggleBypass();
        },
        // select up
        ArrowUp: () => {
          if (props.selectedNode && props.selectedNode.parents.length)
            props.selectedNode.parents[0].select();
        },
        // select down
        ArrowDown: () => {
          if (props.selectedNode && props.selectedNode.children.length)
            props.selectedNode.children[0].select();
        },
        // select left
        ArrowLeft: () => {
          if (props.selectedNode && props.selectedNode.children.length) {
            let idx = props.selectedNode.children[0].parents.indexOf(
              props.selectedNode
            );
            idx--;

            if (idx >= 0) {
              props.selectedNode.children[0].parents[idx].select();
            }
          }
        },
        // select right        
        ArrowRight: () => {
          if (props.selectedNode && props.selectedNode.children.length) {
            let idx = props.selectedNode.children[0].parents.indexOf(
              props.selectedNode
            );
            idx++;

            if (idx <= props.selectedNode.children[0].parents.length - 1)
              props.selectedNode.children[0].parents[idx].select();
          }
        },
        // add selection up 
        "Shift+ArrowUp": () => { 
          if (props.selectedNode && props.selectedNode.parents.length) {
            let next = props.selectedNode.parents[0];
            
            if(clipboard.selection.includes(next)) {
              clipboard.removeSelection(props.selectedNode);
            } else {
              clipboard.addSelection(next);
            }            
          }
        },
        // add selection down 
        "Shift+ArrowDown": () => { 
          if (props.selectedNode && props.selectedNode.children.length) {
            let next = props.selectedNode.children[0];

            if(clipboard.selection.includes(next)) {
              clipboard.removeSelection(props.selectedNode);
            } else {
              clipboard.addSelection(next);
            }            
          }
        },
        // add selection left
        "Shift+ArrowLeft": () => {
//           if (props.selectedNode && props.selectedNode.children.length) {
//             let idx = props.selectedNode.children[0].parents.indexOf(
//               props.selectedNode
//             );
//             idx--;

//             if (idx >= 0) {
//               props.selectedNode.children[0].parents[idx].select();
//             }
//           }
        },
        // add selection right
        "Shift+ArrowRight": () => {
//           if (props.selectedNode && props.selectedNode.children.length) {
//             let idx = props.selectedNode.children[0].parents.indexOf(
//               props.selectedNode
//             );
//             idx++;

//             if (idx <= props.selectedNode.children[0].parents.length - 1)
//               props.selectedNode.children[0].parents[idx].select();
//           }
        },
        // swap up
        "$mod+Shift+ArrowUp": () => {
          if (props.selectedNode && props.selectedNode.parents.length)
            if (props.selectedNode.parents[0].parents.length)
              props.selectedNode.swapData(
                props.selectedNode.parents[0].select()
              );
        },
        // swap down
        "$mod+Shift+ArrowDown": () => {
          if (props.selectedNode && props.selectedNode.children.length)
            props.selectedNode.swapData(
              props.selectedNode.children[0].select()
            );
        },
        // swap left
        "$mod+Shift+ArrowLeft": () => {
          //           console.log("Shift+ArrowLeft");
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx--;
          //             if (idx >= 0) {
          //               props.selectedNode.children[0].parents[idx].select();
          //             }
          //           }
        },
        // swap right
        "$mod+Shift+ArrowRight": () => {
          //           console.log("Shift+ArrowRight");
          //           if (props.selectedNode && props.selectedNode.children.length) {
          //             let idx = props.selectedNode.children[0].parents.indexOf(
          //               props.selectedNode
          //             );
          //             idx++;
          //             if (idx <= props.selectedNode.children[0].parents.length - 1)
          //               elect();
          //           }
        },
        // delete
        Delete: () => {
          props.data.removeSelected();
        },
        // copy
        "$mod+c": () => {
          clipboard.copy();
        },
        // cut
        "$mod+x": () => {
          clipboard.cut();
        },
        // paste
        "$mod+v": () => {
          clipboard.paste();
        },
      });
    } else {
      store.context.removeKeymap();
    }
  }, [
    props.selectedNode,
    props.data,
    store.context,
    useKeys,
    props.data.history
  ]);

  const handleContextMenu = e => {
    e.stopPropagation();

    store.context.setContextmenu({
      Clear: {
        id: "Clear",
        label: "Clear",
        onClick: () => store.scene.clear()
      }
    });
  };

  return (
    <GenericPanel
      panel={props.panel}
      onContextMenu={handleContextMenu}
      onFocus={handleFocus}
      onBlur={handleBlur}
      indicators={
        useKeys
          ? [
              {
                label: "k",
                color: store.ui.theme.accent_color,
                title: "Keybind Focus"
              }
            ]
          : null
      }
    >
      {props.data && (
        <GraphComponent
          onRef={mainRef}
          data={props.data}
          coord_bounds={props.coord_bounds}
          selectedNode={props.selectedNode}
        />
      )}

      {props.data && props.data.updateFlag}
    </GenericPanel>
  );
});

export default ShaderGraph;
