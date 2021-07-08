import React, { useEffect, useContext, useState, useRef } from "react";
import { getSnapshot, applySnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import MainContext from "../MainContext";

import {
  ToolbarComponent,
  LayoutContainer,
  GenericPanel,
  ContextMenuComponent
} from "maco-ui";

import "maco-ui/dist/index.css";

import { PanelVariants, LayoutVariants } from "../stores/ui/Variants";

const MainToolbar = observer(props => {
  const store = useContext(MainContext).store;
  const { ui, scene } = store;

  const canvasPanel = ui.getPanel("CANVAS");
  const mainPanel = ui.getPanel("MAIN");
  const mainLayout = mainPanel.layout;

  const handleBreakout = () => {
    store.breakout();
  };

  const handleLayoutSelect = name => {
    let variant = ui.getLayout(name);
    mainPanel.setLayout(variant);
  };

  const handleAddPanel = name => {};

  let layouts = {};

  Array.from(ui.layouts.values()).forEach((e, i) => {
    layouts = {
      ...layouts,
      [e.id]: {
        id: e.id,
        label: e.title,
        onClick: () => handleLayoutSelect(e.id),
        /* no clue why this isn't working */
        highlight: mainLayout.id === e.id,
        buttons: {
          button_one: {
            id: "button_one",
            label: "x",
            title: "remove",
            onClick: () => {
              // can't remove WELCOME
              if (e.id !== "WELCOME") {
                ui.removeLayout(e);
              }
            }
          }
        }
      }
    };
  });

  return (
    <ToolbarComponent
      style={{
        position: "static",
        zIndex: 6
      }}
      items={{
        // Fullscreen: {
        //   id: "Fullscreen",
        //   // title: canvasPanel.fullscreen ? "float canvas" : "fullscreen canvas",
        //   label: "✳",
        //   onClick: () => {
        //     canvasPanel.toggleFullscreen();
        //     canvasPanel.toggleFloating();
        //     canvasPanel.fitScreen();
        //   },
        //   // highlight: !canvasPanel.fullscreen
        // },
        Title: {
          id: "Title",
          label: (
            <h1 style={{ position: "relative", bottom: "1px" }}>camogen</h1>
          )

          // onClick: () => {
          //   setShowAbout(!showAbout);
          // },
          // highlight: showAbout
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
                handleLayoutSelect("PREFERENCES");
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
            Edit_Layout_Name: {
              id: "Edit_Layout_Name",
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
                    placeholder={mainLayout.title}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        console.log("check");
                        ui.addLayout(getSnapshot(mainLayout), e.target.value);
                      }
                    }}
                  />
                </div>
              )
            },

            ...layouts
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

export default MainToolbar;
