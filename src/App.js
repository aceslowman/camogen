import React, { useEffect, useState, useRef } from "react";
import { MainProvider } from "./MainContext";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import tinykeys from "tinykeys";
import {
  ThemeContext,
  ToolbarComponent,
  LayoutContainer,
  GenericPanel,
  ContextMenuComponent,
  MacoWrapperComponent
} from "maco-ui";

import "maco-ui/dist/index.css";

import { PanelVariants, LayoutVariants } from "./stores/ui/Variants";

// TODO: these should be imported from ./components/panels
import { Panels } from "./components/panels";
import ShaderGraphComponent from "./components/panels/ShaderGraphComponent";
import ShaderControlsComponent from "./components/panels/ShaderControlsComponent";
import DebugInfoComponent from "./components/panels/DebugInfoComponent";
import HelpComponent from "./components/panels/HelpComponent";
import ShaderEditorComponent from "./components/panels/ShaderEditorComponent";
import PreferencesComponent from "./components/panels/PreferencesComponent";
import ParameterEditorComponent from "./components/panels/ParameterEditorComponent";
import MessagesComponent from "./components/panels/MessagesComponent";
import CanvasDisplay from "./components/panels/CanvasDisplayComponent";

import MissingAssets from "./components/MissingAssetsComponent";
import Splash from "./components/SplashComponent";
import Updates from "./components/UpdatesComponent";
import MainToolbar from "./components/MainToolbar";

const App = observer(props => {
  const { store } = props;
  const { ui, scene } = store;

  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      "$mod+KeyS": e => {
        e.preventDefault();
        props.store.save();
      },
      "$mod+KeyO": e => {
        e.preventDefault();
        props.store.load();
      }
    });

    return unsubscribe;
  }, [props.store]);

  const getPanel = panel => {
    if (Panels.has(panel.id)) {
      let Component = Panels.get(panel.id);
      return <Component key={panel.id} panel={panel} />;
    }
  };

  return (
    <MacoWrapperComponent store={store}>
      <MainProvider value={{ store: store }}>
        {props.store.ready && <MainToolbar />}

        <CanvasDisplay panel={canvasPanel} />

        {store.ready && (
          <GenericPanel panel={mainPanel} subtitle={store.name}>
            <LayoutContainer layout={mainLayout}>
              {Array.from(mainLayout.panels).map(e => {
                return getPanel(e[1]);
              })}
            </LayoutContainer>
          </GenericPanel>
        )}

        {store.showUpdates && (
          <Updates onRemove={() => store.setShowUpdates(!store.showUpdates)} />
        )}

        {store.showSplash && (
          <Splash onRemove={() => store.setShowSplash(!store.showSplash)} />
        )}

        {store.showMissingAssets && (
          <MissingAssets
            onRemove={() =>
              store.setShowMissingAssets(!store.showMissingAssets)
            }
          />
        )}
      </MainProvider>
    </MacoWrapperComponent>
  );
});

export default App;
