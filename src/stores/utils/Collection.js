import {
  types,
  flow,
  getParent,
  getSnapshot,
  applySnapshot
} from "mobx-state-tree";
import Shader from "../shaders/ShaderStore";

/* 
  COLLECTION 
  
  TODO: 
    this has too much overlap with the Graph class
*/

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
    },
    get root() {
      let node = self.nodes.values().next().value;

      while (node && node.children.length) {
        node = node.children[0];
      }

      return node;
    },

    distanceBetween(a, b) {
      let node = a;
      let count = 0;

      while (node !== b && node.children[0]) {
        node = node.children[0];
        count++;
      }

      return count;
    },

    distanceFromTrunk(a) {
      let node = a;
      let count = 0;

      while (node.children.length) {
        if (node.children[0].parents.length > 1) {
          if (node.children[0].parents[0] !== node) {
            count++;
          }
        }

        node = node.children[0];
      }

      return count;
    },

    get selectedNode() {
      // if (isAlive(self)) return self.clipboard.currentlySelected;
    }
  }))
  .actions(self => ({
    traverseFrom: (node = self.root, f = null, depthFirst = false) => {
    // traverse: (f = null, depthFirst = false) => {
      //       let result = [];
      //       let container = [self];
      //       let next_node;

      //       while (container.length) {
      //         next_node = container.shift();

      //         if (next_node) {
      //           result.push(next_node);

      //           if (f) f(next_node);

      //           if (next_node.children) {
      //             container = depthFirst
      //               ? container.concat(next_node.children) // depth first search
      //               : next_node.children.concat(container); // breadth first search
      //           }
      //         }
      //       }

      //       return result;
      /*
          traverseFrom will crawl through the graph structure
          either depth first or breadth first.
        */
      let result = [];
      let container = [node];
      let next_node;
      let distance_from_root = 0;
      let distance_from_trunk = 0;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          result.push(next_node);
          distance_from_root = self.distanceBetween(next_node, node);
          distance_from_trunk = self.distanceFromTrunk(next_node);

          if (f) f(next_node, distance_from_root, distance_from_trunk);

          if (next_node.parents) {
            container = depthFirst
              ? container.concat(next_node.parents) // depth first search
              : next_node.parents.concat(container); // breadth first search
          }
        }
      }

      return result;
    },

    addChild: child => {
      // console.log("adding to collection", self);
      self.children.push(child);
    },

    removeChild: child => {
      // console.log("removing from collection", {self:self,child:child});
      self.children = self.children.filter(e => e !== child);
    },

    setData: datasnap => {
      // console.log('setting collection!',getSnapshot(self))
      // console.log('with this shader', getSnapshot(data))
      // let d = getSnapshot(data);

      self.name = datasnap.name;
      self.data = datasnap;
    }
  }));

export default Collection;
