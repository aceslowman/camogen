import GraphNode from "./NodeStore";
import uuidv1 from "uuid/v1";

import { types } from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from "./utils/Coordinate";
import { getOperator } from "./operators";
import Parameter from "./ParameterStore";

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
    selectedNode: types.maybe(types.reference(GraphNode)),
    coord_bounds: types.optional(Coordinate, { x: 0, y: 0 })
  })
  .volatile(() => ({
    queue: []
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
    }
  }))
  .actions(self => {
    /*
            clear()
        */
    function clear() {
      self.selectedNode = undefined;
      // TODO: currently not working when subgraphs are present!
      // TODO: what if I cleared the graph from the root up?
      // re-initialize the nodes map
      self.nodes.clear();

      // create root node, select it
      self.addNode();
      self.root.select();
      // recalculate
      self.update();
    }

    /* 
            update()

            self method will calculate the branches of the
            graph structure and then call afterUpdate()
        */
    function update() {
      let render_queues = calculateBranches();

      // calculate info for visualization
      self.calculateCoordinateBounds();

      self.queue = render_queues;
    }

    function addNode(node = GraphNode.create({ uuid: "add_" + uuidv1() })) {
      return self.nodes.put(node);
    }

    function appendNode(
      node = GraphNode.create({ uuid: "append_" + uuidv1() })
    ) {
      let current_root = self.root;
      let new_node = self.addNode(node);
      current_root.setChild(new_node);
    }
    
    /*
      this makes it possible to move a node up or down the tree
    */
    function swapNodes(target) {
      console.log('swapping with',target);
      // copy children and parents from self
      
      // copy children and parents from target
    }

    function setSelected(node) {
      self.selectedNode = node;
    }

    function removeSelected() {
      self.removeNode(self.selectedNode);
    }

    function removeNode(node) {
      if (node === self.root) return;

      /*
          if node being removed has a parent, make
          sure to reconnect those parent nodes to the
          next child node.
      */
      if (node.parents.length) {
        /* 
            if first child AND deleted node are multi-input
            is multi-input, reassign
        */
        if (node.children[0].parents.length > 1 && node.parents.length > 1) {
          node.parents.forEach((parent, i) => {
            node.children[0].parents[i] = parent;
          });
        } else {
          // otherwise, collapse and map first child to first parent
          node.parents[0].children[0] = node.children[0];
          node.children[0].parents[0] = node.parents[0];

          // remove all pruned parents
          node.parents.forEach((parent, i) => {
            if (i === 0) return;
            if (parent.data) parent.data.onRemove();
            self.nodes.delete(parent.uuid);
          });
        }
      } else {
        let idx = node.children[0].parents.indexOf(node);
        node.children[0].parents.splice(idx, 1);
      }

      node.children[0].mapInputsToParents();

      self.selectedNode = node.children[0];
      if (node.data) node.data.onRemove();
      self.nodes.delete(node.uuid);

      self.update();
    }

    /*
        traverse(f = null, depthFirst = false)

        self method will crawl through the graph structure
        either depth first or breadth first.

        it's first argument is function that will be called
        during each step of the traversal.
    */
    function traverse(f = null, depthFirst = false) {
      let result = [];
      let container = [self.root];
      let next_node;
      let distance_from_root = 0;
      let distance_from_trunk = 0;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          result.push(next_node);
          distance_from_root = self.distanceBetween(next_node, self.root);
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
    }

    /* 
        calculateBranches()

        returns an array of queues, by branch_id
    */
    function calculateBranches() {
      let x = 0;

      let current_branch = 0;
      let render_queues = [];

      self.traverse((next_node, d_root, d_trunk) => {
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
    }

    /*
        calculateCoordinateBounds()

        returns an object representing the size of the graph,
        for centering, scaling, and positioning visualization
    */
    function calculateCoordinateBounds() {
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
    }

    return {
      clear,
      update,
      appendNode,
      addNode,
      swapNodes,
      setSelected,
      removeSelected,
      removeNode,
      traverse,
      calculateBranches,
      calculateCoordinateBounds
      // calculateBranches: () => undoManager.withoutUndo(calculateBranches),
      // calculateCoordinateBounds: () => undoManager.withoutUndo(calculateCoordinateBounds),
    };
  });

// TODO: ideally this lives in it's own file, but there are circular dependency issues
// that are unresolved with mobx-state-tree late
const operatorGraph = types
  .model("OperatorGraph", {
    param: types.reference(Parameter)
  })
  .actions(self => {
    function afterAttach() {
      self.addNode();
      self.update();
    }

    function setSelectedByName(name) {
      if (!self.selectedNode) self.selectedNode = self.root;
      let op = getOperator(name);
      if (op) {
        self.selectedNode.setData(op);
        self.update();
      } else {
        console.error("operator was not found!");
      }
    }

    /*
        afterUpdate(queue)
    */
    function afterUpdate() {
      // this allows the parameter to remain unchanged
      // when the graph is empty.
      if (self.nodes.size <= 1) return;

      // traverses tree from root
      if (self.root.parents.length) {
        let result = self.root.parents[0].data.update();

        self.param.setValue(result);
      }
    }

    return {
      afterAttach,
      afterUpdate,
      getOperator,
      setSelectedByName
    };
  });

export const OperatorGraph = types
  .compose(
    Graph,
    operatorGraph
  )
  .named("OperatorGraph");
export default Graph;
