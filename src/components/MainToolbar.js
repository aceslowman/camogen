import React, { useEffect, useState, useRef } from "react";
import { MainProvider } from "../MainContext";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";

import {
  ThemeContext,
  ToolbarComponent,
  LayoutContainer,
  GenericPanel,
  ContextMenuComponent
} from "maco-ui";

import "maco-ui/dist/index.css";

import { PanelVariants, LayoutVariants } from "../stores/ui/Variants";

const MainToolbar = observer(props => {
  const { store } = props;
  const { ui, scene } = store;
  
  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;
  
  const handleBreakout = () => {
    store.breakout();
  };
  
  const handleLayoutSelect = name => {
    let variant = ui.getLayoutVariant(name);
    mainPanel.setLayout(variant);
  };

  const handleAddPanel = name => {};
  
  return (
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
            Reload: {
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
});
