import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import RootStore from "./stores/RootStore";
import makeInspectable from "mobx-devtools-mst";
import "regenerator-runtime/runtime";
import { UIStore, Themes } from "maco-ui";

import { CorePanels, CoreLayouts } from "./stores/ui/Panel";

const layouts = null;
const panels = null;

const root = RootStore.create({
  ui: UIStore.create({
    layouts: {
      MAIN: CoreLayouts['WELCOME'],
    },
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
        position: [window.innerWidth / 2 - (window.innerWidth - 100)/2, window.innerHeight / 2 - (window.innerHeight - 100)/2]
      },
      MAIN: {
        id: "MAIN",
        // title: "camogen",
        floating: true,
        canFloat: false,
        collapsible: true,
        fullscreen: false,
        canFullscreen: true,
        dimensions: [700, 500],
        position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250]
      }
    },
    theme: Themes.yutani
  })
});

makeInspectable(root);

ReactDOM.render(<App store={root} />, document.getElementById("root"));
// ReactDOM.render(<App store={root} history={undoManager}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



/*
{
  id: "main",
  // title: "camogen",
  floating: true,
  canFloat: false,
  collapsible: true,
  fullscreen: false,
  canFullscreen: true,
  dimensions: [700, 500],
  position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250]
}
*/