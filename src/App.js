import React, { useEffect, useState, useRef } from "react";
import { MainProvider } from "./MainContext";
import { observer } from "mobx-react";

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

import CaptureOverlay from "./components/overlays/CaptureOverlayComponent";
import AboutOverlay from "./components/overlays/AboutOverlayComponent";

import tinykeys from "tinykeys";
import {
  ThemeContext,
  ToolbarComponent,
  LayoutContainer,
  GenericPanel,
  ContextMenuComponent
} from "maco-ui";

import "maco-ui/dist/index.css";
import { getSnapshot, applySnapshot } from "mobx-state-tree";

const App = observer(props => {
  const { store } = props;
  const { ui } = store;

  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;

  // console.log("mainPanel", mainPanel);
  // console.log("mainLayout", mainLayout);
  // console.log("canvasPanel", canvasPanel);

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      "$mod+KeyZ": () => {
        console.log("undo");
        if (props.history.canUndo) {
          console.log("HISTORY", getSnapshot(props.history));
          props.history.undo();
        } else {
          console.log("all out of undo");
        }
      },
      "$mod+Shift+KeyZ": () => {
        console.log("redo");
        if (props.history.canRedo) {
          console.log("HISTORY", getSnapshot(props.history));
          props.history.redo();
        } else {
          console.log("all out of redo");
        }
      },
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
  }, [props.history, props.store]);

  const handleBreakout = () => {
    props.store.breakout();
  };

  const getPanel = panel => {
    switch (panel.component_type) {
      case "SHADER_GRAPH":
        return (
          <ShaderGraphComponent
            key={panel.id}
            selectedNode={props.store.scene.shaderGraph.selectedNode}
            coord_bounds={props.store.scene.shaderGraph.coord_bounds}
            data={props.store.scene.shaderGraph}
            panel={panel}
          />
        );
      case "SHADER_EDITOR":
        return (
          <ShaderEditorComponent
            key={panel.id}
            node={store.scene.shaderGraph.selectedNode}
            data={store.scene.shaderGraph.selectedNode.data}
            graph={store.scene.shaderGraph}
            hasChanged={
              store.scene.shaderGraph.selectedNode.data
                ? store.scene.shaderGraph.selectedNode.data.hasChanged
                : null
            }
            panel={panel}
          />
        );
      case "SHADER_CONTROLS":
        return (
          <ShaderControlsComponent
            key={panel.id}
            data={store.scene.shaderGraph}
            selectedNode={store.scene.shaderGraph.selectedNode}
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

  const handleLayoutSelect = name => {
    let variant = ui.getLayoutVariant(name);
    mainPanel.setLayout(variant);
  };

  const handleAddPanel = name => {};

  const main_panel_toolbar = props.store.ready && (
    <ToolbarComponent
      style={{
        position: "static"
      }}
      items={[
        {
          title: canvasPanel.fullscreen ? "float canvas" : "fullscreen canvas",
          label: "✳",
          onClick: () => {
            canvasPanel.toggleFullscreen();
            canvasPanel.toggleFloating();
            canvasPanel.fitScreen();
          },
          highlight: !canvasPanel.fullscreen
        },
        {
          label: <h1>camogen</h1>,
          onClick: () => {
            setShowAbout(!showAbout);
          },
          highlight: showAbout
        },
        {
          label: "File",
          dropDown: [
            {
              label: (
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row"
                  }}
                >
                  <label>name:</label>
                  <input
                    style={{
                      backgroundColor: "inherit",
                      color: "inherit",
                      border: "none",
                      width: "100%",
                      marginLeft: 4,
                      fontFamily: "inherit"
                    }}
                    type="text"
                    placeholder={props.store.name}
                    onChange={e => {
                      props.store.setName(e.target.value);
                    }}
                  />
                </div>
              )
            },
            {
              label: "Save Scene",
              onClick: () => {
                props.store.save();
              }
            },
            {
              label: "Load Scene",
              onClick: () => props.store.load()
            },
            {
              label: "New Scene",
              onClick: () => {
                props.store.scene.clear();
              }
            },
            {
              label: "Preferences",
              onClick: () => {
                mainLayout.clear();
                mainLayout.addPanel("PREFERENCES");
              }
            }
          ]
        },
        {
          label: "Library",
          dropDown: props.store.shaderLibrary()
        },
        {
          label: "Layout",
          dropDown: [
            {
              label: "Welcome",
              onClick: () => handleLayoutSelect("WELCOME")
            },
            {
              label: "Shader Edit",
              onClick: () => handleLayoutSelect("SHADER_EDIT")
            },
            {
              label: "Shader Control",
              onClick: () => handleLayoutSelect("SHADER_CONTROL")
            },
            {
              label: "Parameter Editor",
              onClick: () => handleLayoutSelect("PARAMETER")
            },
            {
              label: "Debug",
              onClick: () => handleLayoutSelect("DEBUG")
            },
            {
              label: "Add Panel",
              dropDown: [
                {
                  label: "Shader Graph",
                  onClick: () => handleAddPanel("SHADER_GRAPH")
                },
                {
                  label: "Shader Editor",
                  onClick: () => handleAddPanel("SHADER_EDITOR")
                },
                {
                  label: "Shader Controls",
                  onClick: () => handleAddPanel("SHADER_CONTROLS")
                },
                {
                  label: "Parameter Editor",
                  onClick: () => handleAddPanel("PARAMETER_EDITOR")
                },
                {
                  label: "Help",
                  onClick: () => handleAddPanel("HELP")
                },
                {
                  label: "Debug",
                  onClick: () => handleAddPanel("DEBUG")
                },
                {
                  label: "Messages",
                  onClick: () => handleAddPanel("MESSAGES")
                },
                {
                  label: "Preferences",
                  onClick: () => handleAddPanel("PREFERENCES")
                },
                {
                  label: "Capture",
                  onClick: () => handleAddPanel("CAPTURE")
                }
              ]
            }
          ]
        },
        {
          label: "Snapshot",
          onClick: () => props.store.snapshot()
        },
        {
          label: "Breakout",
          onClick: handleBreakout
        }
      ]}
    />
  );

  const handleContextMenu = e => {
    // prevents context menu anywhere that hasn't been
    // explicitly allowed
    props.store.context.setContextmenu();
  };

  return (
    <MainProvider value={{ store: props.store }}>
      <ThemeContext.Provider value={ui.theme}>
        <div
          id="APP"
          ref={mainRef}
          onContextMenu={handleContextMenu}
          style={{
            backgroundColor: ui.theme.secondary_color
          }}
        >
          <ContextMenuComponent items={store.context.contextmenu} />

          {main_panel_toolbar}

          <CanvasDisplay panel={canvasPanel} />

          {store.ready && (
            <GenericPanel panel={mainPanel} subtitle={store.name} collapsible>
              <LayoutContainer layout={mainLayout}>
                {Array.from(mainLayout.panels).map(e => {
                  return getPanel(e[1]);
                })}
              </LayoutContainer>
            </GenericPanel>
          )}
        </div>
        {showAbout && (
          <AboutOverlay
            onRemove={() => {
              setShowAbout(!showAbout);
            }}
          />
        )}
      </ThemeContext.Provider>
    </MainProvider>
  );
});

export default App;
