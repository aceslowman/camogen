import { getParent, getSnapshot, types } from "mobx-state-tree";
import { v1 as uuidv1 } from "uuid";

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
        ...CorePanels["HELP"]
      },
      shader_graph: {
        id: "main_shader_graph",
        ...CorePanels["SHADER_GRAPH"]
      },
      shader_controls: {
        id: "main_shader_controls",
        ...CorePanels["SHADER_CONTROLS"]
      }
    }
  },
  SHADER_EDIT: {
    id: "SHADER_EDIT",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "SHADER_EDIT_shader_editor",
        panel: "shader_editor",
        size: 2 / 3
      },
      {
        id: "inner",
        direction: "VERTICAL",
        children: [
          {
            id: "SHADER_EDIT_shader_graph",
            panel: "shader_graph",
            size: 2 / 3
          },
          {
            id: "SHADER_EDIT_messages",
            panel: "messages"
          }
        ]
      }
    ],
    panels: {
      shader_graph: {
        id: "SHADER_EDIT_shader_graph",
        ...CorePanels["SHADER_GRAPH"]        
      },
      messages: {
        id: "SHADER_EDIT_messages",
        ...CorePanels["MESSAGES"]        
      },
      shader_editor: {
        id: "SHADER_EDIT_shader_editor",
        ...CorePanels["SHADER_EDITOR"]        
      }
    }
  },
  SHADER_CONTROL: {
    id: "SHADER_CONTROL",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "shader_graph_panel",
        panel: "SHADER_CONTROL_shader_graph_panel",
        size: 1 / 3
      },
      {
        id: "shader_controls_panel",
        panel: "SHADER_CONTROL_shader_controls"
      }
    ],
    panels: {
      shader_graph: {
        id: "SHADER_CONTROL_shader_graph_panel",        
        ...CorePanels["SHADER_GRAPH"] 
      },
      shader_controls: {
        id: "SHADER_CONTROL_shader_controls_panel",        
        ...CorePanels["SHADER_CONTROLS"] 
      }
    }
  },
  DEBUG: {
    id: "DEBUG",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "debug",
        panel: "DEBUG_debug",
        size: 2 / 3
      },
      {
        id: "inner",
        direction: "VERTICAL",
        children: [
          {
            id: "shader_graph",
            panel: "DEBUG_shader_graph",
            size: 2 / 3
          },
          {
            id: "messages",
            panel: "DEBUG_messages"
          }
        ]
      }
    ],
    panels: {
      shader_graph: {
        id: "DEBUG_shader_graph_panel",
        ...CorePanels["SHADER_GRAPH"] 
      },
      messages: {
        id: "DEBUG_messages_panel",
        ...CorePanels["MESSAGES"] 
      },
      debug: {
        id: "DEBUG_debug_panel",
        ...CorePanels["DEBUG"] 
      }
    }
  },
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