import { types, getParent, applySnapshot, getSnapshot } from "mobx-state-tree";
import Panel, { CorePanels } from "./Panel";

export const CoreLayouts = {
  WELCOME: {
    id: "WELCOME",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "main_help",
        panel: "help",
        size: 1 / 3
      },
      {
        id: "main_shader_graph",
        panel: "shader_graph",
        size: 1 / 3
      },
      {
        id: "main_shader_controls",
        panel: "shader_controls",
        size: 1 / 3
      }
    ],
    panels: {
      help: {
        id: "main_help",
        type: "HELP",
        title: "Welcome",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [250, 300],
        position: [50, 150]
      },
      shader_graph: {
        id: "main_shader_graph",
        type: "SHADER_GRAPH",
        title: "Shader Graph",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 250],
        position: [200, 200]
      },
      shader_controls: {
        id: "main_shader_controls",
        type: "SHADER_CONTROLS",
        title: "Shader Controls",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [250, 400],
        position: [300, 150]
      }
    }
  }
  // SHADER_EDIT: {
  //   id: "main",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "shader_editor",
  //       panel: "shader_editor",
  //       size: 2 / 3
  //     },
  //     {
  //       id: "inner",
  //       direction: "VERTICAL",
  //       children: [
  //         {
  //           id: "shader_graph",
  //           panel: "shader_graph",
  //           size: 2 / 3
  //         },
  //         {
  //           id: "messages",
  //           panel: "messages"
  //         }
  //       ]
  //     }
  //   ],
  //   panels: {
  //     shader_graph: {
  //       id: "shader_graph",
  //       type: "SHADER_GRAPH",
  //       title: "Shader Graph",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     messages: {
  //       id: "messages",
  //       type: "MESSAGES",
  //       title: "Messages",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     shader_editor: {
  //       id: "shader_editor",
  //       type: "SHADER_EDITOR",
  //       title: "Shader Editor",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     }
  //   }
  // },
  // SHADER_CONTROL: {
  //   id: "main",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "shader_graph",
  //       panel: "shader_graph",
  //       size: 1 / 3
  //     },
  //     {
  //       id: "shader_controls",
  //       panel: "shader_controls"
  //     }
  //   ],
  //   panels: {
  //     shader_graph: {
  //       id: "shader_graph",
  //       type: "SHADER_GRAPH",
  //       title: "About",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     shader_controls: {
  //       id: "shader_controls",
  //       type: "SHADER_CONTROLS",
  //       title: "About",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     }
  //   }
  // },
  // DEBUG: {
  //   id: "main",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "debug",
  //       panel: "debug",
  //       size: 2 / 3
  //     },
  //     {
  //       id: "inner",
  //       direction: "VERTICAL",
  //       children: [
  //         {
  //           id: "shader_graph",
  //           panel: "shader_graph",
  //           size: 2 / 3
  //         },
  //         {
  //           id: "messages",
  //           panel: "messages"
  //         }
  //       ]
  //     }
  //   ],
  //   panels: {
  //     shader_graph: {
  //       id: "shader_graph",
  //       type: "SHADER_GRAPH",
  //       title: "Shader Graph",
  //       floating: false,
  //       canFloat: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     messages: {
  //       id: "messages",
  //       type: "MESSAGES",
  //       title: "Messages",
  //       floating: false,
  //       canFloat: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     debug: {
  //       id: "debug",
  //       type: "DEBUG",
  //       title: "Debug",
  //       floating: false,
  //       canFloat: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     }
  //   }
  // },
  // PARAMETER: {
  //   id: "main",
  //   direction: "HORIZONTAL",
  //   size: 1,
  //   children: [
  //     {
  //       id: "shader_graph",
  //       panel: "shader_graph",
  //       size: 1 / 3
  //     },
  //     {
  //       id: "shader_controls",
  //       panel: "shader_controls",
  //       size: 1 / 3
  //     },
  //     // {
  //     //   id: "inner",
  //     //   direction: "VERTICAL",
  //     //   children: [
  //     //     {
  //     //       id: "shader_graph",
  //     //       panel: "shader_graph",
  //     //       size: 2 / 3
  //     //     },
  //     //     {
  //     //       id: "shader_controls",
  //     //       panel: "shader_controls"
  //     //     }
  //     //   ],
  //     //   size: 1 / 3
  //     // },
  //     {
  //       id: "parameter_editor",
  //       panel: "parameter_editor",
  //       size: 1 / 3
  //     }
  //   ],
  //   panels: {
  //     shader_graph: {
  //       id: "shader_graph",
  //       type: "SHADER_GRAPH",
  //       title: "Shader Graph",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     shader_controls: {
  //       id: "shader_controls",
  //       type: "SHADER_CONTROLS",
  //       title: "Shader Controls",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     },
  //     parameter_editor: {
  //       id: "parameter_editor",
  //       type: "PARAMETER_EDITOR",
  //       title: "Parameter Editor",
  //       floating: false,
  //       canFloat: true,
  //       canRemove: true,
  //       defaultWidth: 100,
  //       defaultHeight: 200,
  //       dimensions: [100, 100],
  //       position: [100, 150]
  //     }
  //   }
  // }
};
