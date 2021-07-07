import { getParent, getSnapshot, types } from "mobx-state-tree";
import { nanoid } from "nanoid";

export const PanelVariants = {
  SHADER_GRAPH: {
    id: "SHADER_GRAPH",
    title: "Shader Graph",
    component_type: "SHADER_GRAPH",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  SHADER_EDITOR: {
    id: "SHADER_EDITOR",
    title: "Shader Editor",
    component_type: "SHADER_EDITOR",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  SHADER_CONTROLS: {
    id: "SHADER_CONTROLS",
    title: "Shader Controls",
    component_type: "SHADER_CONTROLS",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  SHADER_LIBRARY: {
    id: "SHADER_LIBRARY",
    title: "Shader Library",
    component_type: "SHADER_LIBRARY",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  PARAMETER_EDITOR: {
    id: "PARAMETER_EDITOR",
    title: "Parameter Editor",
    component_type: "PARAMETER_EDITOR",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  HELP: {
    id: "HELP",
    title: "Help",
    component_type: "HELP",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [300, 450],
    position: [30, 30]
  },
  MEDIA_LIBRARY: {
    id: "MEDIA_LIBRARY",
    title: "Media Library",
    component_type: "MEDIA_LIBRARY",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  DISPLAY: {
    id: "DISPLAY",
    title: "Display",
    component_type: "DISPLAY",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  DEBUG: {
    id: "DEBUG",
    title: "Debug",
    component_type: "DEBUG",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  MESSAGES: {
    id: "MESSAGES",
    title: "Messages",
    component_type: "MESSAGES",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  PREFERENCES: {
    id: "PREFERENCES",
    title: "Preferences",
    component_type: "PREFERENCES",
    subtitle: "",
    floating: false,
    fullscreen: false,
    canFloat: true,
    canRemove: true,
    canFullscreen: false,
    dimensions: [100, 300],
    position: [30, 30]
  },
  // CAPTURE: {
  //   id: "CAPTURE",
  //   title: "Capture",
  //   component_type: "CAPTURE",
  //   subtitle: "",
  //   floating: false,
  //   fullscreen: false,
  //   canFloat: true,
  //   canRemove: true,
  //   canFullscreen: false,
  //   dimensions: [100, 300],
  //   position: [30, 30]
  // }
};

export const LayoutVariants = {
  WELCOME: {
    id: "WELCOME",
    title: "Welcome",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "HELP",
        panel: PanelVariants["HELP"],
        size: 1 / 3
      },
      {
        id: "SHADER_GRAPH",
        panel: PanelVariants["SHADER_GRAPH"],
        size: 1 / 3
      },
      {
        id: "SHADER_CONTROLS",
        panel: PanelVariants["SHADER_CONTROLS"],
        size: 1 / 3
      }
    ]
  },
  // SHADER_EDITOR: {
  //   id: "SHADER_EDITOR",
  //   title: "Shader Edit",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "SHADER_LIBRARY",
  //       panel: PanelVariants["SHADER_LIBRARY"],
  //       size: 1 / 3,
  //     },
  //     {
  //       id: "SHADER_EDITOR",
  //       panel: PanelVariants["SHADER_EDITOR"],
  //       size: 1 / 3
  //     },
  //     {
  //       id: "inner",
  //       direction: "VERTICAL",
  //       size: 1 / 3,
  //       children: [
  //         {
  //           id: "SHADER_GRAPH",
  //           panel: PanelVariants["SHADER_GRAPH"],
  //           size: 3 / 4
  //         },
  //         {
  //           id: "MESSAGES",
  //           panel: PanelVariants["MESSAGES"],
  //           size: 1 / 4
  //         }
  //       ]
  //     }
  //   ]
  // },
  // SHADER_CONTROL: {
  //   id: "SHADER_CONTROL",
  //   title: "Shader Control",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "SHADER_GRAPH",
  //       panel: PanelVariants["SHADER_GRAPH"],
  //       size: 1 / 3
  //     },
  //     {
  //       id: "SHADER_CONTROLS",
  //       panel: PanelVariants["SHADER_CONTROLS"],
  //       size: 1 / 3
  //     },
  //     {
  //       id: "inner",
  //       direction: "VERTICAL",
  //       size: 1 / 4,
  //       children: [
  //         {
  //           id: "DISPLAY",
  //           panel: PanelVariants["DISPLAY"],
  //           size: 3 / 4
  //         },
  //         {
  //           id: "MEDIA_LIBRARY",
  //           panel: PanelVariants["MEDIA_LIBRARY"],
  //           size: 1 / 4
  //         }
  //       ]
  //     }
  //   ]
  // },
  // DEBUG: {
  //   id: "DEBUG",
  //   title: "Debug",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "DEBUG",
  //       panel: PanelVariants["DEBUG"],
  //       size: 2 / 3
  //     },
  //     {
  //       id: "inner",
  //       direction: "VERTICAL",
  //       children: [
  //         {
  //           id: "SHADER_GRAPH",
  //           panel: PanelVariants["SHADER_GRAPH"],
  //           size: 2 / 3
  //         },
  //         {
  //           id: "MESSAGES",
  //           panel: PanelVariants["MESSAGES"],
  //         }
  //       ]
  //     }
  //   ]
  // },
  // PARAMETER: {
  //   id: "PARAMETER",
  //   title: "Parameter",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "SHADER_GRAPH",
  //       panel: PanelVariants["SHADER_GRAPH"],
  //       size: 1 / 3
  //     },
  //     {
  //       id: "SHADER_CONTROLS",
  //       panel: PanelVariants["SHADER_CONTROLS"],
  //       size: 1 / 3
  //     },
  //     {
  //       id: "PARAMETER_EDITOR",
  //       panel: PanelVariants["PARAMETER_EDITOR"],
  //       size: 1 / 3
  //     }
  //   ]
  // },
  // PREFERENCES: {
  //   id: "PREFERENCES",
  //   title: "Preferences",
  //   size: 1,
  //   children: [
  //     {
  //       id: "PREFERENCES",
  //       panel: PanelVariants["PREFERENCES"],
  //       size: 1
  //     }
  //   ]
  // },
  // MEDIA_LIBRARY: {
  //   id: "MEDIA_LIBRARY",
  //   title: "Media Library",
  //   size: 1,
  //   children: [
  //     {
  //       id: "MEDIA_LIBRARY",
  //       panel: PanelVariants["MEDIA_LIBRARY"],
  //       size: 1
  //     }
  //   ]
  // }
};
