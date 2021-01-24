import { getParent, getRoot, types } from "mobx-state-tree";
import { OperatorGraph } from "./GraphStore";
import { nanoid } from "nanoid";

const Parameter = types
  .model("Parameter", {
    uuid: types.identifier,
    name: types.maybe(types.string),
    value: types.optional(
      types.union(types.number, types.string, types.boolean),
      0
    ),
    graph: types.maybe(types.late(() => OperatorGraph)),
    controlType: types.maybe(types.string)
  })
  .volatile(self => ({
    uniform: null
  }))
  .actions(self => ({
    afterAttach: () => {
      self.uniform = getParent(self, 2);
      // console.log(getParent(self, 3))
      // self.graph =
    },

    createGraph: () => {
      let parent_shader = getParent(self, 4);
      let parent_scene = getRoot(self).scene;

      self.graph = OperatorGraph.create({
        uuid: "opgraph_" + nanoid(),
        param: self
      });
      
      parent_shader.addOperatorGraph(self.graph)
      
      self.graph.addNode().select(); // initial root node!
    },

    clearGraph: () => {
      self.graph = undefined;
    },

    setValue: v => {
      self.value = v;
    }
  }));

export default Parameter;
