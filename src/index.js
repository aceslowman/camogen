import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { undoManager } from "./stores/UndoManager";
import RootStore from "./stores/RootStore";
import makeInspectable from "mobx-devtools-mst";
import "regenerator-runtime/runtime";
import { UIStore, Themes } from "maco-ui";

import { PanelVariants, LayoutVariants } from "./stores/ui/Variants";

const mainPanel = {
  id: "MAIN",
  floating: true,
  canFloat: false,
  collapsible: false,
  fullscreen: false,
  canFullscreen: true,
  dimensions: [800, 500],
  position: [window.innerWidth / 2 - 400, window.innerHeight / 2 - 250],
  layout: LayoutVariants["WELCOME"]
};

const root = RootStore.create({
  ui: UIStore.create({
    theme: Themes.yutani,
    panels: {
      MAIN: mainPanel
    }
  })
});

root.ui.setPanelVariants(PanelVariants);

/* this populates the layout system */
root.ui.setCustomLayouts({
  WELCOME: { ...mainPanel, id: "WELCOME", title: "Welcome" }
});

makeInspectable(root);

ReactDOM.render(
  <App store={root} history={undoManager} />,
  document.getElementById("root")
);
