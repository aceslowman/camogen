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
  const { ui, scene } = store;

  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;

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
    store.breakout();
  };

  const getPanel = panel => {
    switch (panel.component_type) {
      case "SHADER_GRAPH":
        return (
          <ShaderGraphComponent
            key={panel.id}
            selectedNode={scene.shaderGraph.selectedNode}
            coord_bounds={scene.shaderGraph.coord_bounds}
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
            selectedNode={scene.shaderGraph.selectedNode}
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
      items={{
        Fullscreen: {
          id: "Fullscreen",
          title: canvasPanel.fullscreen ? "float canvas" : "fullscreen canvas",
          label: "✳",
          onClick: () => {
            canvasPanel.toggleFullscreen();
            canvasPanel.toggleFloating();
            canvasPanel.fitScreen();
          },
          highlight: !canvasPanel.fullscreen
        },
        Title: {
          id: "Title",
          label: <h1>camogen</h1>,
          onClick: () => {
            setShowAbout(!showAbout);
          },
          highlight: showAbout
        },
        File: {
          id: "File",
          label: "File",
          dropDown: {
            Edit_Name: {
              id: "Edit_Name",
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
                    placeholder={store.name}
                    onChange={e => {
                      store.setName(e.target.value);
                    }}
                  />
                </div>
              )
            },
            Save_Scene: {
              id: "Save_Scene",
              label: "Save Scene",
              onClick: () => {
                store.save();
              }
            },
            Load_Scene: {
              id: "Load_Scene",
              label: "Load Scene",
              onClick: () => store.load()
            },
            New_Scene: {
              id: "New_Scene",
              label: "New Scene",
              onClick: () => {
                store.scene.clear();
              }
            },
            Preferences: {
              id: "Preferences",
              label: "Preferences",
              onClick: () => {
                mainLayout.clear();
                mainLayout.addPanel("PREFERENCES");
              }
            }
          }
        },
        Library: {
          id: "Library",
          label: "Library",
          dropDown: {
            ...store.shaderLibrary,
            "Reload": {
              id: "Reload",
              label: "Reload Defaults",
              onClick: () => store.reloadDefaults()
            }
          }
        },
        Layout: {
          id: "Layout",
          label: "Layout",
          dropDown: {
            Welcome: {
              id: "Welcome",
              label: "Welcome",
              onClick: () => handleLayoutSelect("WELCOME")
            },
            Shader_Edit: {
              id: "Shader_Edit",
              label: "Shader Edit",
              onClick: () => handleLayoutSelect("SHADER_EDIT")
            },
            Shader_Control: {
              id: "Shader_Control",
              label: "Shader Control",
              onClick: () => handleLayoutSelect("SHADER_CONTROL")
            },
            Parameter_Editor: {
              id: "Parameter_Editor",
              label: "Parameter Editor",
              onClick: () => handleLayoutSelect("PARAMETER")
            },
            Debug: {
              id: "Debug",
              label: "Debug",
              onClick: () => handleLayoutSelect("DEBUG")
            },
            Add_Panel: {
              id: "Add_Panel",
              label: "Add Panel",
              dropDown: {
                "Shader Graph": {
                  id: "Shader Graph",
                  label: "Shader Graph",
                  onClick: () => handleAddPanel("SHADER_GRAPH")
                },
                "Shader Editor": {
                  id: "Shader Editor",
                  label: "Shader Editor",
                  onClick: () => handleAddPanel("SHADER_EDITOR")
                },
                "Shader Controls": {
                  id: "Shader Controls",
                  label: "Shader Controls",
                  onClick: () => handleAddPanel("SHADER_CONTROLS")
                },
                "Parameter Editor": {
                  id: "Parameter Editor",
                  label: "Parameter Editor",
                  onClick: () => handleAddPanel("PARAMETER_EDITOR")
                },
                Help: {
                  id: "Help",
                  label: "Help",
                  onClick: () => handleAddPanel("HELP")
                },
                Debug: {
                  id: "Debug",
                  label: "Debug",
                  onClick: () => handleAddPanel("DEBUG")
                },
                Messages: {
                  id: "Messages",
                  label: "Messages",
                  onClick: () => handleAddPanel("MESSAGES")
                },
                Preferences: {
                  id: "Preferences",
                  label: "Preferences",
                  onClick: () => handleAddPanel("PREFERENCES")
                },
                Capture: {
                  id: "Capture",
                  label: "Capture",
                  onClick: () => handleAddPanel("CAPTURE")
                }
              }
            }
          }
        },
        Breakout: {
          id: "Breakout",
          label: "Breakout",
          onClick: handleBreakout
        }
      }}
    />
  );

  const handleContextMenu = e => {
    // prevents context menu anywhere that hasn't been
    // explicitly allowed
    store.context.setContextmenu();
  };

  return (
    <MainProvider value={{ store: store }}>
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
