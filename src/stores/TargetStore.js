import { types, getRoot, getParent } from "mobx-state-tree";
import GraphNode from "./NodeStore";
import { undoManager } from "./GraphStore";

const Target = types
  .model("Target", {
    render_queue: types.array(types.safeReference(types.late(() => GraphNode)))
  })
  .volatile(() => ({
    ref: null
  }))
  .actions(self => ({
    afterAttach: () => {
      let root_store = getRoot(self);
      let parent_scene = getParent(self, 2);

      let p = root_store.p5_instance;

      self.ref = p.createGraphics(p.width, p.height, p.WEBGL);
    },

    clear: () => {
      self.render_queue = [];
    },

    setRenderQueue: queue => {
      self.render_queue = queue;
    },

    removeShaderNode: shader => {
      let parent_scene = getParent(self, 2);
      self.render_queue = self.render_queue.filter(
        item => item.uuid !== shader.uuid
      );

      if (self.render_queue.length === 0) parent_scene.removeTarget(self);
    }
  }));

export default Target;
