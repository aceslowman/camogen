import { types, getParent, applySnapshot, getSnapshot } from "mobx-state-tree";
import Panel, { CorePanels } from "./Panel";

const Layout = types
  .model("Layout", {
    id: types.identifier,
    size: 0,
    panel: types.maybe(types.safeReference(Panel)),
    children: types.array(types.late(() => Layout)),
    panels: types.maybe(types.map(Panel)),
    direction: types.optional(
      types.enumeration(["VERTICAL", "HORIZONTAL"]),
      "HORIZONTAL"
    )
  })
  .views(self => ({
    get isEmpty() {
      let result =
        self.children.length &&
        self.children.filter(
          s => (!s.panel && !s.isEmpty) || (s.panel && !s.panel.floating)
        ).length === 0;
      return result;
    }
  }))
  .actions(self => {
    let siblings;

    function afterAttach() {
      siblings = getParent(self);
    }

    function adjust(size) {
      let self_index = siblings.indexOf(self);

      let adjusted_size = size;

      let sum =
        self_index > 0
          ? siblings
              .slice(0, self_index)
              .filter(s => !s.floating)
              .reduce((a, b) => a + b.size, 0)
          : 0;

      adjusted_size = size - sum;

      if (adjusted_size > 100) adjusted_size = 100;
      if (adjusted_size < 0) adjusted_size = 0;

      self.setSize(adjusted_size);
    }

    function distributeChildren() {
      self.children.forEach((e, i) => {
        console.log(i,(i + 1) / self.children.length)
        e.setSize((1) / self.children.length);
      });
    }

    function setSize(size) {
      self.size = size;
    }

    function setLayout(layout) {
      // if layout is a string, look it up from list of defaults
      if (typeof layout === "string" && CoreLayouts[layout]) {
        layout = CoreLayouts[layout];
      }

      applySnapshot(self, layout);
    }

    function addPanel(panel) {
      // if panel is a string, look it up from list of defaults
      if (typeof panel === "string" && CorePanels[panel]) {
        panel = CorePanels[panel];
      }

      let layout = Layout.create({
        id: panel.id,
        panel: panel.id,
        size: 1 / self.children.length
      });

      self.panels.put(panel);
      self.children.push(layout);

      console.log("self", self);

      self.distributeChildren();      
    }

    function removePanel(panel) {
      if (self.panels) self.panels.delete(panel);
      if (self.children) {
        self.children = self.children.filter(e => e.panel !== panel);

        self.children.forEach(e => {
          e.removePanel(panel);
        });

        console.log("SELF", getSnapshot(self));

        // TODO: if all panels are gone, remove this layout
        // if(!self.children.length) {
        //     console.log(getParent(self,1))
        //     let parent = getParent(self, 1);
        //     parent.children.filter(e => e !== self)
        // }
      }
    }

    function clear() {
      if (self.panels && self.children) {
        self.panels.clear();
        self.children = [];
      }
    }

    // function removeLayout(layout) {
    //     if(self.children) self.children.filter(e => e !== layout);
    // }

    return {
      afterAttach,
      adjust,
      setSize,
      setLayout,
      addPanel,
      removePanel,
      clear,
      distributeChildren
    };
  });

export default Layout;

export const CoreLayouts = {
  WELCOME: {
    id: "main",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "help",
        panel: "help",
        size: 1 / 3
      },
      {
        id: "shader_graph",
        panel: "shader_graph",
        size: 1 / 3
      },
      {
        id: "shader_controls",
        panel: "shader_controls",
        size: 1 / 3
      }
    ],
    panels: {
      help: {
        id: "help",
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
        id: "shader_graph",
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
        id: "shader_controls",
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
  },
  SHADER_EDIT: {
    id: "main",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "shader_editor",
        panel: "shader_editor",
        size: 2 / 3
      },
      {
        id: "inner",
        direction: "VERTICAL",
        children: [
          {
            id: "shader_graph",
            panel: "shader_graph",
            size: 2 / 3
          },
          {
            id: "messages",
            panel: "messages"
          }
        ]
      }
    ],
    panels: {
      shader_graph: {
        id: "shader_graph",
        type: "SHADER_GRAPH",
        title: "Shader Graph",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      messages: {
        id: "messages",
        type: "MESSAGES",
        title: "Messages",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      shader_editor: {
        id: "shader_editor",
        type: "SHADER_EDITOR",
        title: "Shader Editor",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      }
    }
  },
  SHADER_CONTROL: {
    id: "main",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "shader_graph",
        panel: "shader_graph",
        size: 1 / 3
      },
      {
        id: "shader_controls",
        panel: "shader_controls"
      }
    ],
    panels: {
      shader_graph: {
        id: "shader_graph",
        type: "SHADER_GRAPH",
        title: "About",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      shader_controls: {
        id: "shader_controls",
        type: "SHADER_CONTROLS",
        title: "About",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      }
    }
  },
  DEBUG: {
    id: "main",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "debug",
        panel: "debug",
        size: 2 / 3
      },
      {
        id: "inner",
        direction: "VERTICAL",
        children: [
          {
            id: "shader_graph",
            panel: "shader_graph",
            size: 2 / 3
          },
          {
            id: "messages",
            panel: "messages"
          }
        ]
      }
    ],
    panels: {
      shader_graph: {
        id: "shader_graph",
        type: "SHADER_GRAPH",
        title: "Shader Graph",
        floating: false,
        canFloat: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      messages: {
        id: "messages",
        type: "MESSAGES",
        title: "Messages",
        floating: false,
        canFloat: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      debug: {
        id: "debug",
        type: "DEBUG",
        title: "Debug",
        floating: false,
        canFloat: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      }
    }
  },
  PARAMETER: {
    id: "main",
    direction: "HORIZONTAL",
    size: 1,
    children: [
      {
        id: "inner",
        direction: "VERTICAL",
        children: [
          {
            id: "shader_graph",
            panel: "shader_graph",
            size: 2 / 3
          },
          {
            id: "shader_controls",
            panel: "shader_controls"
          }
        ],
        size: 1 / 3
      },
      {
        id: "parameter_editor",
        panel: "parameter_editor",
        size: 2 / 3
      }
    ],
    panels: {
      shader_graph: {
        id: "shader_graph",
        type: "SHADER_GRAPH",
        title: "Shader Graph",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      shader_controls: {
        id: "shader_controls",
        type: "SHADER_CONTROLS",
        title: "Shader Controls",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      },
      parameter_editor: {
        id: "parameter_editor",
        type: "PARAMETER_EDITOR",
        title: "Parameter Editor",
        floating: false,
        canFloat: true,
        canRemove: true,
        defaultWidth: 100,
        defaultHeight: 200,
        dimensions: [100, 100],
        position: [100, 150]
      }
    }
  }
};
