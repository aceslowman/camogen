import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../MainContext";
import useResizeObserver from "../hooks/ResizeHook";
import { GenericPanel } from "maco-ui";
import { observer } from "mobx-react";
import style from "./CanvasDisplayComponent.module.css";

const CanvasDisplay = observer(props => {
  const store = useContext(MainContext).store;
  const [useKeys, setUseKeys] = useState(false);
  const wrapper_ref = useRef(null);

  useResizeObserver(() => {
    // const ctx = canvas_ref.current.getContext('2d');
    // const wrapper_bounds = wrapper_ref.current.getBoundingClientRect();
    // let _labels = [];
    if (store.breakoutControlled) return;
    if (!store.p5_instance) return;

    let bounds = wrapper_ref.current.getBoundingClientRect();

    store.p5_instance.resizeCanvas(bounds.width, bounds.height);

    // update target dimensions
    for (let target_data of store.scene.targets) {
      target_data.ref.resizeCanvas(bounds.width, bounds.height);
    }
  }, wrapper_ref);

  // const handleFocus = (e) => {
  // 	setUseKeys(e ? true : false);
  // }

  // useEffect(()=>{
  // 	if(useKeys) {
  // 		store.context.setKeymap({
  // 			"ArrowUp": () => {
  // 				if (props.selectedNode && props.selectedNode.parents.length)
  // 					props.selectedNode.parents[0].select()
  // 			},
  // 			"ArrowDown": () => {
  // 				if (props.selectedNode && props.selectedNode.children.length)
  // 					props.selectedNode.children[0].select()
  // 			},
  // 			"ArrowLeft": () => {
  // 				if (props.selectedNode && props.selectedNode.children.length) {
  // 					let idx = props.selectedNode.children[0].parents.indexOf(props.selectedNode);
  // 					idx--;

  // 					if (idx >= 0) {
  // 						props.selectedNode.children[0].parents[idx].select();
  // 					}
  // 				}
  // 			},
  // 			"ArrowRight": () => {
  // 				if (props.selectedNode && props.selectedNode.children.length) {
  // 					let idx = props.selectedNode.children[0].parents.indexOf(props.selectedNode);
  // 					idx++;

  // 					if (idx <= props.selectedNode.children[0].parents.length - 1)
  // 						props.selectedNode.children[0].parents[idx].select();
  // 				}
  // 			},
  // 			"Delete": () => {
  // 				props.data.removeSelected();
  // 			}
  // 		})
  // 	} else {
  // 		store.context.removeKeymap();
  // 	}
  // }, [
  // 	props.selectedNode,
  // 	props.data,
  // 	store.context,
  // 	useKeys
  // ])

  // const handleContextMenu = (e) => {
  // 	e.stopPropagation();
  // 	e.preventDefault();
  // 	store.context.setContextmenu([{
  // 		label: "Clear",
  // 		onClick: () => store.scene.clear()
  // 	}])
  // }

  return (
    <GenericPanel
      panel={props.panel}
      // onContextMenu={handleContextMenu}
      // onFocus={handleFocus}
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
      style={{
        zIndex: 0
      }}
      showTitle={false}
    >
      {/* {props.data && (
				<GraphComponent 
					data={props.data}
					coord_bounds={props.coord_bounds}
					selectedNode={props.selectedNode}
				/>
			)}

			{ props.data && props.data.updateFlag } */}
      {/* { store.p5_instance && store.p5_instance.canvas } */}
      <div id="canvastest" ref={wrapper_ref} className={style.canvastest}></div>
    </GenericPanel>
  );
});

export default CanvasDisplay;
