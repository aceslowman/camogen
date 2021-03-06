import GraphNode from "./NodeStore";
import { nanoid } from "nanoid";
import {
  types,
  applySnapshot,
  getSnapshot,
  clone,
  detach,
  destroy,
  isAlive,
  isValidReference
} from "mobx-state-tree";
import { UndoManager } from "mst-middlewares";
import Coordinate from "./utils/Coordinate";
import { getOperator } from "./operators";
import Parameter from "./ParameterStore";
import Shader from "./shaders/ShaderStore";
import Clipboard from "./utils/Clipboard";

export const branch_colors = [
  "#0000FF", // blue
  "#FF0000", // red
  "#FFFF00", // yellow
  "#00FF00", // neon green
  "#9900FF", // purple
  "#FF6000" // orange
];

const Graph = types
  .model("Graph", {
    uuid: types.identifier,
    nodes: types.map(GraphNode),
    coord_bounds: types.optional(Coordinate, { x: 0, y: 0 }),
    // history: types.optional(UndoManager, {}),
    clipboard: types.optional(Clipboard, () => Clipboard.create())
  })
  .volatile(() => ({
    queue: [],
    history: undoManager
  }))
  .views(self => ({
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
      if (isAlive(self)) return self.clipboard.currentlySelected;
    }
  }))
  .actions(self => {
    // setUndoManager(self);

    return {
      afterAttach: () => {
        self.update(); // ESSENTIAL FOR GRAPHS TO RELOAD
      },

      clear: () => {
        self.clipboard.clear();

        self.queue = [];

        // THIS DID IT! "Not a child" error resolved by destroying the internal shader
        self.traverseFrom().forEach((e, i) => {
          if (e.data) destroy(e.data);
        });

        self.nodes.clear();

        // create root node, select it
        self.addNode();
        self.root.select();

        // recalculate
        self.update();
      },

      update: () => {
        /* 
        self method will calculate the branches of the
        graph structure and then call afterUpdate()
      */
        let render_queues = self.calculateBranches();

        // calculate info for visualization
        self.calculateCoordinateBounds();

        self.queue = render_queues;
      },

      addNode: (node = GraphNode.create({ uuid: "add_" + nanoid() })) => {
        return self.nodes.put(node);
      },

      appendNode: (node = GraphNode.create({ uuid: "append_" + nanoid() })) => {
        let current_root = self.root;
        let new_node = self.addNode(node);
        current_root.setChild(new_node);
      },

      removeNode: node => {
        // can't remove root (root is always empty!)
        if (node === self.root) return;
        // can't remove empty nodes!
        // if (!node.data) return;

        /*
          does the node have parents?
        */
        if (node.parents.length) {
          /* 
            is the child an MIN (multi-input node)?
          */

          if (
            node.children[0].parents.length > 1 &&
            node.children[0].parents.indexOf(node) > 0
          ) {
            // delete all uptree nodes
            node.parents.forEach((parent, i) => {
              self
                .traverseFrom(parent, null, true)
                .map(e => e.uuid)
                .reverse()
                .forEach(e => self.nodes.delete(e));
            });
          } else {
            // otherwise, collapse and map first child to first parent
            node.parents[0].children[0] = node.children[0];
            node.children[0].parents[0] = node.parents[0];

            // remove all pruned parents
            node.parents.forEach((parent, i) => {
              if (i === 0) return;
              self
                .traverseFrom(parent, null, true)
                .map(e => e.uuid)
                .reverse()
                .forEach(e => self.nodes.delete(e));
            });
          }
        } else {
          let idx = node.children[0].parents.indexOf(node);
          node.children[0].parents.splice(idx, 1);
        }

        // after deleting, select parent, unless there are none
        let child = node.children[0];
        self.clipboard.select(node.parents.length ? node.parents[0] : child);

        self.nodes.delete(node.uuid);

        // should re-add missing parents
        child.mapInputsToParents();

        self.update();
      },

      insertBelow: (
        node,
        _new_node = GraphNode.create({
          uuid: "append_" + nanoid()
        })
      ) => {
        /* 
        for the time being, the behavior of this is to 
        insert a passthru shader in the parent[0] slot
      */
        let idx = node.children[0].parents.indexOf(node);

        let new_node = self.addNode(_new_node);

        node.children[0].setParent(new_node, idx);
        new_node.setChild(node.children[0], 0);
        node.setChild(new_node, 0);
        new_node.setParent(node, 0);

        return new_node;
      },

      traverseFrom: (node = self.root, f = null, depthFirst = false) => {
        /*
          self method will crawl through the graph structure
          either depth first or breadth first.

          it's first argument is function that will be called
          during each step of the traversal.
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

      calculateBranches: () => {
        /* 
        returns an array of queues, by branch_id
      */
        let x = 0;

        let current_branch = 0;
        let render_queues = [];

        self.traverseFrom(self.root, (next_node, d_root, d_trunk) => {
          next_node.branch_index = undefined;
          next_node.trunk_distance = d_trunk;
          next_node.coordinates.set(x, d_root);

          // if we hit the topmost node
          if (!next_node.parents.length) {
            let t_node = next_node;
            t_node.setBranchIndex(current_branch);

            if (current_branch >= render_queues.length) {
              render_queues.push([]);
            }

            // only add to render queue if there is data to process
            if (t_node.data) render_queues[current_branch].push(t_node);

            // propogate the new branch down the chain
            // until it hits a node already with a branch_index
            while (
              t_node.children.length &&
              t_node.children[0].branch_index === undefined
            ) {
              t_node.children[0].setBranchIndex(current_branch);
              t_node = t_node.children[0];

              if (current_branch >= render_queues.length) {
                render_queues.push([]);
              }

              if (t_node.data) render_queues[current_branch].push(t_node);
            }

            current_branch++;
            x++;
          }
        });

        return render_queues;
      },

      calculateCoordinateBounds: () => {
        /*
          returns an object representing the size of the graph,
          for centering, scaling, and positioning visualization
        */
        let max_x = 0;
        let max_y = 0;

        self.nodes.forEach(v => {
          max_x = v.coordinates.x > max_x ? v.coordinates.x : max_x;
          max_y = v.coordinates.y > max_y ? v.coordinates.y : max_y;
        });

        self.coord_bounds = {
          x: max_x,
          y: max_y
        };

        return self.coord_bounds;
      },

      removeSelected: () => {
        self.removeNode(self.selectedNode);
      }
    };
  });

// TODO: ideally this lives in it's own file, but there are circular dependency issues
// that are unresolved with mobx-state-tree late
const operatorGraph = types
  .model("OperatorGraph", {
    param: types.reference(Parameter)
  })
  .actions(self => ({
    setSelectedByName: name => {
      if (!self.selectedNode) self.clipboard.select(self.root);
      let op = getOperator(name);
      if (op) {
        self.selectedNode.setData(op);
        self.update();
      } else {
        console.error("operator was not found!");
      }
    },

    afterUpdate: () => {
      // this allows the parameter to remain unchanged
      // when the graph is empty.
      if (self.nodes.size <= 1) return;

      // traverses tree from root
      if (self.root.parents.length) {
        let result = self.root.parents[0].data.update();

        self.param.setValue(result);
      }
    }
  }));

export const OperatorGraph = types
  .compose(
    Graph,
    operatorGraph
  )
  .named("OperatorGraph");
export default Graph;

export let undoManager = {};
export const setUndoManager = targetStore => {
  undoManager = UndoManager.create(
    {},
    { targetStore: targetStore, maxHistoryLength: 10 }
  );
};
