import React, { useEffect, useState, useRef } from "react";

import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import { MainProvider } from "./MainContext";
import { PanelVariants, LayoutVariants } from "./stores/ui/Variants";
import { Panels } from "./components/panels";

import {
  ThemeContext,
  ToolbarComponent,
  LayoutContainer,
  GenericPanel,
  ContextMenuComponent,
  MacoWrapperComponent
} from "maco-ui";
import "maco-ui/dist/index.css";
import "./App.css";

// Dialogs
import MissingAssets from "./components/dialogs/MissingAssetsComponent";
import Splash from "./components/dialogs/SplashComponent";
import Updates from "./components/dialogs/UpdatesComponent";

import MainToolbar from "./components/MainToolbar";

import useKeymap from "./components/hooks/UseKeymap";

const App = observer(props => {
  const { store } = props;
  const { ui, scene } = store;

  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;

  useKeymap(
    {
      "$mod+KeyS": e => {
        e.preventDefault();
        props.store.save();
      },
      "$mod+KeyO": e => {
        e.preventDefault();
        props.store.load();
      }
    },
    true
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      // TODO:                                   // TODO:
      // this should only occur if something in state has changed
      const beforeUnload = e => {
        let message = "You have unsaved data!";
        e.returnValue = message;
        return message;
      };
      window.addEventListener("beforeunload", beforeUnload);
      window.onbeforeunload = beforeUnload;
      return window.removeEventListener("beforeunload", beforeUnload);
    }
  }, []);

  const getPanelComponent = panel => {
    if (Panels.has(panel.component_type)) {
      let Component = Panels.get(panel.component_type);
      return <Component key={panel.component_type} panel={panel} />;
    }
  };
  
  console.log('icomponents',               Object.values(store.ui.panelVariants).map((e) => {
                console.log('e',e)
                return getPanelComponent(e);
              }))

  return (
    <MacoWrapperComponent store={store} className='gridpatterned'>
      <MainProvider value={{ store: store }}>
        {props.store.ready && <MainToolbar />}

        {store.ready && (
          <GenericPanel panel={mainPanel} subtitle={store.name}>
            <LayoutContainer layout={mainLayout}>
              {Object.values(store.ui.panelVariants).map((e) => {
                console.log('e',e)
                return getPanelComponent(e);
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
