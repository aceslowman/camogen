import React, { useEffect, useState, useRef } from "react";
import { MainProvider } from "./MainContext";
import { observer } from "mobx-react";

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
import { getSnapshot } from "mobx-state-tree";

const App = observer(props => {
  const { store } = props;
  const { ui } = store;
  
  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

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
      "$mod+KeyS": (e) => {
        e.preventDefault();
        props.store.save();
      },
      "$mod+KeyO": (e) => {
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
  console.log(panel)
    switch (panel.type) {
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
            node={props.store.scene.shaderGraph.selectedNode}
            data={props.store.scene.shaderGraph.selectedNode.data}
            graph={props.store.scene.shaderGraph}
            hasChanged={
              props.store.scene.shaderGraph.selectedNode.data
                ? props.store.scene.shaderGraph.selectedNode.data.hasChanged
                : null
            }
            panel={panel}
          />
        );
      case "SHADER_CONTROLS":
        return (
          <ShaderControlsComponent
            key={panel.id}
            data={props.store.scene.shaderGraph}
            selectedNode={props.store.scene.shaderGraph.selectedNode}
            panel={panel}
          />
        );
      case "PARAMETER_EDITOR":
        return (
          <ParameterEditorComponent
            key={panel.id}
            data={props.store.selectedParameter}
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
  
  console.log('HIT',ui.layouts.get('main'))

  const main_panel_toolbar = props.store.ready && (
    <ToolbarComponent
      style={{
        position: "static"
      }}
      items={[
        {
          title: props.store.mainCanvasPanel.fullscreen
            ? "float canvas"
            : "fullscreen canvas",
          label: "✳",
          onClick: () => {
            props.store.mainCanvasPanel.toggleFullscreen();
            props.store.mainCanvasPanel.toggleFloating();
            props.store.mainCanvasPanel.fitScreen();
          },
          highlight: !props.store.mainCanvasPanel.fullscreen
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
              // label: "Save Scene",
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
                props.store.layout.clear();
                props.store.layout.addPanel("PREFERENCES");
              }
            }
          ]
        },
        {
          label: "Library",
          dropDown: props.store.shaderLibrary()
        },
        {
          label: "Workspace",
          dropDown: [
            {
              label: "Welcome",
              onClick: () => ui.layouts.get('main').setLayout("WELCOME")
            },
            {
              label: "Shader Edit",
              onClick: () => ui.layouts.get('main').setLayout("SHADER_EDIT")
            },
            {
              label: "Shader Control",
              onClick: () => ui.layouts.get('main').setLayout("SHADER_CONTROL")
            },
            {
              label: "Parameter Editor",
              onClick: () => ui.layouts.get('main').setLayout("PARAMETER")
            },
            {
              label: "Debug",
              onClick: () => ui.layouts.get('main').setLayout("DEBUG")
            },
            {
              label: "Add Panel",
              dropDown: [
                {
                  label: "Shader Graph",
                  onClick: () => ui.layouts.get('main').addPanel("SHADER_GRAPH")
                },
                {
                  label: "Shader Editor",
                  onClick: () => ui.layouts.get('main').addPanel("SHADER_EDITOR")
                },
                {
                  label: "Shader Controls",
                  onClick: () => ui.layouts.get('main').addPanel("SHADER_CONTROLS")
                },
                {
                  label: "Parameter Editor",
                  onClick: () => ui.layouts.get('main').addPanel("PARAMETER_EDITOR")
                },
                {
                  label: "Help",
                  onClick: () => ui.layouts.get('main').addPanel("HELP")
                },
                {
                  label: "Debug",
                  onClick: () => ui.layouts.get('main').addPanel("DEBUG")
                },
                {
                  label: "Messages",
                  onClick: () => ui.layouts.get('main').addPanel("MESSAGES")
                },
                {
                  label: "Preferences",
                  onClick: () => ui.layouts.get('main').addPanel("PREFERENCES")
                },
                {
                  label: "Capture",
                  onClick: () => ui.layouts.get('main').addPanel("CAPTURE")
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
  
  const mainPanel = ui.getPanel('main');
  const mainLayout = ui.getLayout('main');
  
  console.log('mainPanel',mainPanel)
  console.log('mainLayout',mainLayout)
  
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
          <ContextMenuComponent items={ui.context} />

          {main_panel_toolbar}

          <CanvasDisplay panel={store.mainCanvasPanel} />

          {store.ready && (
            <GenericPanel
              panel={mainPanel}
              subtitle={store.name}
              collapsible
            >
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
