import React, { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../MainContext";
import GraphComponent from "../graph/GraphComponent";
import { GenericPanel } from "maco-ui";
import { observer } from "mobx-react";

const ShaderGraph = observer(props => {
  const store = useContext(MainContext).store;
  const [useKeys, setUseKeys] = useState(false);
  const mainRef = useRef();

  const handleFocus = e => {
    setUseKeys(e ? true : false);
  };

  useEffect(() => {
    if (useKeys) {
      store.context.setKeymap({
        ArrowUp: () => {
          if (props.selectedNode && props.selectedNode.parents.length)
            props.selectedNode.parents[0].select();
        },
        ArrowDown: () => {
          if (props.selectedNode && props.selectedNode.children.length)
            props.selectedNode.children[0].select();
        },
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
        Delete: () => {
          props.data.removeSelected();
        }
      });
    } else {
      store.context.removeKeymap();
    }
  }, [props.selectedNode, props.data, store.context, useKeys]);

  const handleContextMenu = e => {
    console.log("shader graph context", e.currentTarget);
    console.log(e.target)
    console.log(e)
    console.log("mainref", mainRef.current);
    // e.preventDefault();
    // e.stopPropagation();
    
    console.log('bubbles',e.bubbles)

    // if (e.target === mainRef.current)
      store.context.setContextmenu([
        {
          label: "Clear",
          onClick: () => store.scene.clear()
        }
      ]);
  };

  return (
    <GenericPanel      
      panel={props.panel}
      onContextMenuCapture={handleContextMenu}
      onFocus={handleFocus}
      indicators={
        useKeys
          ? [
              {
                label: "k",
                color: store.theme.accent_color,
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
