import { getParent, getRoot, types } from "mobx-state-tree";
import { OperatorGraph } from "./GraphStore";
import { Uniform } from "./ShaderStore";

const Parameter = types
  .model("Parameter", {
    uuid: types.identifier,
    // uniform: types.maybe(types.reference(types.late(() => Uniform))),
    name: types.maybe(types.string),
    value: types.optional(
      types.union(types.number, types.string, types.boolean),
      0
    ),
    graph: types.maybe(types.reference(types.late(() => OperatorGraph))),
    controlType: types.maybe(types.string)
  })
  .actions(self => {
    let parent_uniform;

    function afterAttach() {
      parent_uniform = getParent(self, 2);
    }

    function createGraph() {
      // parent_uniform = getParent(self, 2);

      let parent_shader = getParent(self, 4);
      let parent_scene = getRoot(self).scene;

      let opgraph = parent_scene.addOperatorGraph(self);

      parent_shader.addToUpdateGroup(opgraph);

      self.graph = opgraph;

      self.graph.root.select();
    }

    function setValue(v) {
      self.value = v;
    }

    return {
      afterAttach,
      createGraph,
      setValue
    };
  });

export default Parameter;
