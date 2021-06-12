import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { undoManager } from "./stores/UndoManager";
import RootStore from "./stores/RootStore";
import makeInspectable from "mobx-devtools-mst";
import "regenerator-runtime/runtime";
import { UIStore, Themes } from "maco-ui";

import { PanelVariants, LayoutVariants } from "./stores/ui/Variants";

const root = RootStore.create({
  ui: UIStore.create({
    theme: Themes.yutani,
    panels: {
      CANVAS: {
        id: "CANVAS",
        title: "canvas",
        floating: false,
        canFloat: false,
        collapsible: true,
        fullscreen: true,
        canFullscreen: true,
        showTitle: false,
        dimensions: [window.innerWidth - 100, window.innerHeight - 100],
        // position: [window.innerWidth / 2 - (window.innerWidth - 100)/2, window.innerHeight / 2 - (window.innerHeight - 100)/2]
        position: [0,15]
      },
      MAIN: {
        id: "MAIN",
        floating: true,
        canFloat: false,
        // collapsible: true,
        collapsible: false,
        fullscreen: false,
        canFullscreen: true,
        dimensions: [700, 500],
        position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250],
        layout: LayoutVariants['WELCOME']
      }
    }
  })
});

root.ui.setPanelVariants(PanelVariants);
root.ui.setLayoutVariants(LayoutVariants);

makeInspectable(root);

ReactDOM.render(<App store={root} history={undoManager}/>, document.getElementById('root'));
