import { getParent, getSnapshot, types } from "mobx-state-tree";
import { v1 as uuidv1 } from "uuid";
import Layout from "./Layout";

export const CorePanels = {
  MAIN: {
    // id: "MAIN",
    // title: "camogen",
    floating: true,
    canFloat: false,
    collapsible: true,
    fullscreen: false,
    canFullscreen: true,
    dimensions: [700, 500],
    position: [window.innerWidth / 2 - 350, window.innerHeight / 2 - 250]
  },
  SHADER_GRAPH: {
    // id: "SHADER_GRAPH",
    title: "Shader Graph",
    type: "SHADER_GRAPH",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  SHADER_EDITOR: {
    // id: "SHADER_EDITOR",
    title: "Shader Editor",
    type: "SHADER_EDITOR",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  SHADER_CONTROLS: {
    // id: "SHADER_CONTROLS",
    title: "Shader Controls",
    type: "SHADER_CONTROLS",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  PARAMETER_EDITOR: {
    // id: "PARAMETER_EDITOR",
    title: "Parameter Editor",
    type: "PARAMETER_EDITOR",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  HELP: {
    // id: "HELP",
    title: "Help",
    type: "HELP",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  DEBUG: {
    // id: "DEBUG",
    title: "Debug",
    type: "DEBUG",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  MESSAGES: {
    // id: "MESSAGES",
    title: "Messages",
    type: "MESSAGES",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  PREFERENCES: {
    // id: "PREFERENCES",
    title: "Preferences",
    type: "PREFERENCES",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  },
  CAPTURE: {
    // id: "CAPTURE",
    title: "Capture",
    type: "CAPTURE",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [10, 10]
  }
};
