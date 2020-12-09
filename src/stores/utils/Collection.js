import { types, flow, getParent, applySnapshot } from "mobx-state-tree";
import Shader from "../ShaderStore";

const Collection = types
  .model("Collection", {
    id: types.identifier,
    path: types.maybe(types.string),
    name: types.maybe(types.string),
    size: types.maybe(types.number),
    type: types.maybe(types.enumeration("Type", ["directory", "file"])),
    children: types.maybe(types.array(types.late(() => Collection))),
    extension: types.maybe(types.string),
    data: types.maybe(types.late(() => Shader))
  })
  .views(self => ({
    getByName: name => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          if (next_node.name === name) result.push(next_node);

          if (next_node.children) {
            container = container.concat(next_node.children); // depth first search
          }
        }
      }
      if (result.length > 1)
        console.log("multiple results found for " + name, result);

      return result[0];
    },
    parent: () => {
      return getParent(self, 2);
    }
  }))
  .actions(self => {
    const traverse = (f = null, depthFirst = false) => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          result.push(next_node);

          if (f) f(next_node);

          if (next_node.children) {
            container = depthFirst
              ? container.concat(next_node.children) // depth first search
              : next_node.children.concat(container); // breadth first search
          }
        }
      }

      return result;
    };

    const addChild = child => {
      // console.log("adding to collection", self);
      self.children.push(child);
    };

    const removeChild = child => {
      // console.log("removing from collection", {self:self,child:child});
      self.children = self.children.filter(e => e !== child);
    };

    const setData = data => applySnapshot(self.data, data);

    return {
      traverse,
      addChild,
      removeChild,
      setData
    };
  });

export default Collection;
