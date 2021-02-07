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

import ShaderGraphComponent from "./components/panels/ShaderGraphComponent";
import ShaderControlsComponent from "./components/panels/ShaderControlsComponent";
import DebugInfoComponent from "./components/panels/DebugInfoComponent";
import HelpComponent from "./components/panels/HelpComponent";
import ShaderEditorComponent from "./components/panels/ShaderEditorComponent";
import PreferencesComponent from "./components/panels/PreferencesComponent";
import ParameterEditorComponent from "./components/panels/ParameterEditorComponent";
import MessagesComponent from "./components/panels/MessagesComponent";
import CaptureComponent from "./components/panels/CaptureComponent";
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
    switch (panel.component_type) {
      case "SHADER_GRAPH":
        return (
          <ShaderGraphComponent
            key={panel.id}
            data={scene.shaderGraph}
            panel={panel}
          />
        );
      case "SHADER_EDITOR":
        return (
          <ShaderEditorComponent
            key={panel.id}
            node={scene.shaderGraph.selectedNode}
            data={scene.shaderGraph.selectedNode.data}
            graph={scene.shaderGraph}
            hasChanged={
              scene.shaderGraph.selectedNode.data
                ? scene.shaderGraph.selectedNode.data.hasChanged
                : null
            }
            panel={panel}
          />
        );
      case "SHADER_CONTROLS":
        return (
          <ShaderControlsComponent
            key={panel.id}
            data={scene.shaderGraph}
            panel={panel}
          />
        );
      case "PARAMETER_EDITOR":
        return (
          <ParameterEditorComponent
            key={panel.id}
            data={store.selectedParameter}
            panel={panel}
          />
        );
      case "HELP":
        return <HelpComponent key={panel.id} panel={panel} />;
      case "DEBUG":
        return <DebugInfoComponent key={panel.id} panel={panel} />;
      case "MESSAGES":
        return (
          <MessagesComponent
            key={panel.id}
            data={props.store.messages}
            log={props.store.messages.log}
            panel={panel}
          />
        );
      case "PREFERENCES":
        return <PreferencesComponent key={panel.id} panel={panel} />;
      case "CAPTURE":
        return <CaptureComponent key={panel.id} panel={panel} />;
      default:
        break;
    }
  };

  const handleContextMenu = e => {
    // prevents context menu anywhere that hasn't been
    // explicitly allowed
    store.context.setContextmenu();
  };

  return (
    <MacoWrapperComponent
      store={store}
      titlebar={{}}
      contextmenu={store.context.contextmenu}
    >
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
