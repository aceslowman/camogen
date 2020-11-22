import { getParent, getSnapshot, types } from "mobx-state-tree";
import { v1 as uuidv1 } from "uuid";
import Layout from "./Layout";

const toolbarHeight = 24;

const Panel = types
  .model("Panel", {
    id: types.identifier,
    type: "",
    title: types.maybe(types.string),
    subtitle: types.maybe(types.string),
    showTitle: true,
    floating: false,
    fullscreen: false,
    canFloat: false,
    canRemove: false,
    canFullscreen: false,
    dimensions: types.array(types.number),
    position: types.array(types.number),
    layout: types.maybe(types.reference(types.late(() => Layout)))
  })
  .actions(self => {
    let parent_layout;

    function setFloating(f) {
      self.floating = f;
    }
    
    function toggleFloating() {
      self.floating = !self.floating;
    }

    function setPosition(p) {
      // TEMP: hack to keep away from title, use safe areas instead
      if(p[1] < 24) p[1] = 24;
      self.position = p;
    }

    function setDimensions(d) {      
      self.dimensions = d;
    }

    function setFullscreen(f) {
      self.fullscreen = f;
    }
    
    function toggleFullscreen() {
      self.fullscreen = !self.fullscreen;
    }

    function onRemove() {
      parent_layout = getParent(self, 2);
      parent_layout.removePanel(self);
    }

    function center() {
      self.position[0] = window.innerWidth / 2 - self.dimensions[0] / 2;
      self.position[1] = window.innerHeight / 2 - self.dimensions[1] / 2;
    }

    function fitScreen() {
      if (self.position[0] <= 0) self.position[0] = 0;

      if (self.position[1] <= 0) self.position[1] = 0;

      if (self.dimensions[0] + self.position[0] >= window.innerWidth)
        self.dimensions[0] = window.innerWidth - self.position[0];

      if (self.dimensions[1] + self.position[1] >= window.innerHeight)
        self.dimensions[1] = window.innerHeight - self.position[1];
    }

    return {
      setFloating,
      toggleFloating,
      setPosition,
      setDimensions,
      setFullscreen,
      toggleFullscreen,
      center,
      fitScreen,
      onRemove
    };
  });

export default Panel;

export const CorePanels = {
  SHADER_GRAPH: {
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
    id: uuidv1(),
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
