import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { undoManager } from "./stores/UndoManager";
import RootStore from "./stores/RootStore";
import "regenerator-runtime/runtime";
import { UIStore, Themes } from "./ui";

import { PanelVariants, LayoutVariants } from "./stores/ui/Variants";

const mainPanel = {
  id: "MAIN",
  floating: false,
  canFloat: false,
  collapsible: false,
  fullscreen: true,
  canFullscreen: true,
  dimensions: [window.innerWidth - 250, window.innerHeight - 200],
  position: [125, 100],
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
  WELCOME: { ...mainPanel, id: "WELCOME", title: "Welcome" },
  SHADER_EDITOR: { ...mainPanel, id: "SHADER_EDITOR", title: "Shader Editor", layout: LayoutVariants["SHADER_EDITOR"] },
});

const container = document.getElementById('root');
const r = createRoot(container) 
r.render(<App store={root} history={undoManager} />);