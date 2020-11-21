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
  const mainRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (props.store.breakoutControlled) return;
      if (!props.store.p5_instance) return;

      let bounds = mainRef.current.getBoundingClientRect();

      props.store.p5_instance.resizeCanvas(bounds.width, bounds.height);

      // update target dimensions
      for (let target_data of props.store.scene.targets) {
        target_data.ref.resizeCanvas(bounds.width, bounds.height);
      }

      // props.store.p5_instance.draw();
      props.store.mainPanel.fitScreen();
    };

    window.addEventListener("resize", handleResize);

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
      "$mod+KeyS": () => {
        props.store.save();
      },
      "$mod+KeyO": () => {
        props.store.load();
      }
    });

    return unsubscribe;
  }, [props.history, props.store]);

  const handleBreakout = () => {
    props.store.breakout();
  };

  const getPanel = panel => {
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

  const main_panel_toolbar = props.store.ready && (
    <ToolbarComponent
      items={[
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
              onClick: () => props.store.layout.setLayout("WELCOME")
            },
            {
              label: "Shader Edit",
              onClick: () => props.store.layout.setLayout("SHADER_EDIT")
            },
            {
              label: "Shader Control",
              onClick: () => props.store.layout.setLayout("SHADER_CONTROL")
            },
            {
              label: "Parameter Editor",
              onClick: () => props.store.layout.setLayout("PARAMETER")
            },
            {
              label: "Debug",
              onClick: () => props.store.layout.setLayout("DEBUG")
            },
            {
              label: "Add Panel",
              dropDown: [
                {
                  label: "Shader Graph",
                  onClick: () => props.store.layout.addPanel("SHADER_GRAPH")
                },
                {
                  label: "Shader Editor",
                  onClick: () => props.store.layout.addPanel("SHADER_EDITOR")
                },
                {
                  label: "Shader Controls",
                  onClick: () => props.store.layout.addPanel("SHADER_CONTROLS")
                },
                {
                  label: "Parameter Editor",
                  onClick: () => props.store.layout.addPanel("PARAMETER_EDITOR")
                },
                {
                  label: "Help",
                  onClick: () => props.store.layout.addPanel("HELP")
                },
                {
                  label: "Debug",
                  onClick: () => props.store.layout.addPanel("DEBUG")
                },
                {
                  label: "Messages",
                  onClick: () => props.store.layout.addPanel("MESSAGES")
                },
                {
                  label: "Preferences",
                  onClick: () => props.store.layout.addPanel("PREFERENCES")
                },
                {
                  label: "Capture",
                  onClick: () => props.store.layout.addPanel("CAPTURE")
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

  const handleContextMenu = (e) => {
    // prevents context menu anywhere that hasn't been
    // explicitly allowed
    console.log('hit')
    props.store.context.setContextmenu();
  };

  return (
    <MainProvider value={{ store: props.store }}>
      <ThemeContext.Provider value={props.store.theme}>
        
        <div
          id="APP"
          ref={mainRef}
          onContextMenu={handleContextMenu}
          style={{
            backgroundColor: props.store.mainPanel.fullscreen
              ? props.store.theme.secondary_color
              : "transparent"
          }}
        >
          
          <ContextMenuComponent items={props.store.context.contextmenu} />
          
          {main_panel_toolbar}

          <CanvasDisplay panel={props.store.mainCanvasPanel} />

          {props.store.ready && (
            <GenericPanel
              panel={props.store.mainPanel}
              subtitle={props.store.name}
              collapsible
            >
              <LayoutContainer layout={props.store.layout}>
                {Array.from(props.store.layout.panels).map(e => {
                  return getPanel(e[1]);
                })}
              </LayoutContainer>
            </GenericPanel>
          )}

          {/*{!props.store.mainPanel.fullscreen && <CaptureOverlay />}*/}
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
