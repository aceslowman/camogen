import { getParent, getSnapshot, getRoot, types } from "mobx-state-tree";
import { OperatorGraph } from "./GraphStore";
import { nanoid } from "nanoid";

const valueType = types.optional(
  types.union(types.number, types.string, types.boolean),
  0
);

const Parameter = types
  .model("Parameter", {
    uuid: types.identifier,
    name: types.maybe(types.string),
    default: valueType,
    value: valueType,
    graph: types.maybe(types.late(() => OperatorGraph)),
    controlType: types.maybe(types.string)
  })
  .volatile(self => ({
    uniform: null
  }))
  .actions(self => ({
    afterAttach: () => {
      self.uniform = getParent(self, 2);
    },

    createGraph: () => {
      let parent_shader = getParent(self, 4);
      let parent_scene = getRoot(self).scene;

      self.graph = OperatorGraph.create({
        uuid: "opgraph_" + nanoid(),
        param: self
      });

      parent_shader.addOperatorGraph(self.graph);

      self.graph.addNode().select(); // initial root node!
    },

    clearGraph: () => {
      self.graph = undefined;
    },

    setValue: v => {
      self.value = v;
    },

    resetDefault: () => {
      console.log("resetting to default value", getSnapshot(self));
      self.value = self.default;
    }
  }));

export default Parameter;
