import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import RootStore from "./stores/RootStore";
import makeInspectable from "mobx-devtools-mst";
import "regenerator-runtime/runtime";
import { UIStore, Themes } from "maco-ui";

import { CorePanels } from "./stores/ui/Panel";
import { CoreLayouts } from "./stores/ui/Layout";

const layouts = null;
const panels = null;

const root = RootStore.create({
  ui: UIStore.create({
    layouts: {
      main: CoreLayouts['WELCOME'],
      // "canvas": CoreLayouts
    },
    panels: CorePanels,
    theme: Themes.weyland
  })
});

makeInspectable(root);

ReactDOM.render(<App store={root} />, document.getElementById("root"));
// ReactDOM.render(<App store={root} history={undoManager}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
