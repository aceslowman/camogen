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
      MAIN: {
        id: "MAIN",
        floating: true,
        canFloat: false,
        collapsible: false,
        fullscreen: false,
        canFullscreen: true,
        dimensions: [700, 500],
        position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250],
        layout: LayoutVariants['WELCOME']
        // layout: LayoutVariants['SHADER_CONTROL']
        // layout: LayoutVariants['SHADER_EDITOR']
      }
    }
  })
});

root.ui.setPanelVariants(PanelVariants);
root.ui.setLayoutVariants(LayoutVariants);

makeInspectable(root);

ReactDOM.render(<App store={root} history={undoManager}/>, document.getElementById('root'));
