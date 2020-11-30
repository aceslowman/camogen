import Shader from "./ShaderStore";
import WebcamInput from "./shaders/inputs/WebcamInput";
import ImageInput from "./shaders/inputs/ImageInput";
import { types, getParent, getSnapshot } from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from "./utils/Coordinate";
import uuidv1 from "uuid/v1";
import { allOps } from "./operators";

// NOTE: rearranged ImageInput and Shader, keep an eye on this for issues
const PossibleData = types.union(
  {
    dispatcher: snap => {
      if (snap) {
        if (snap.type === "Shader") return Shader;
        if (snap.type === "WebcamInput") return WebcamInput;
        if (snap.type === "ImageInput") return ImageInput;
        return allOps;
      } else {
        return Shader;
      }
    }
  },
  Shader,
  allOps,
  ImageInput,
  WebcamInput
);

const nodeRef = types.safeReference(types.late(() => GraphNode));

const GraphNode = types
  .model("GraphNode", {
    uuid: types.identifier,
    name: "empty node",
    data: types.maybe(PossibleData),
    children: types.array(nodeRef),
    parents: types.array(nodeRef),
    selected: false,
    coordinates: types.optional(Coordinate, { x: 0, y: 0 })
  })
  .volatile(self => ({
    branch_index: 0,
    trunk_distance: 0
  }))
  .actions(self => {
    let parent_graph;

    function afterAttach() {
      parent_graph = getParent(self, 2);
    }
    
    function setName(n) {
      self.name = n;
    }

    function setData(data) {
      self.data = data;
      self.name = data.name;

      // extract uniforms, map inputs/outputs
      parent_graph.update();
      parent_graph.afterUpdate();
      mapInputsToParents();
    }

    function mapInputsToParents() {
      if (!self.data) return;

      // add new parent
      self.data.inputs.forEach((e, i) => {
        // add parent if necessary
        if (i >= self.parents.length) {
          let parent = GraphNode.create({
            uuid: uuidv1(),
            name: e
          });

          parent_graph.addNode(parent);
          self.setParent(parent, i, true);
          
          console.log('node snapshot', getSnapshot(self))
        }
      });

      // add new node if no children are present
      if (!self.children.length) {
        let child = GraphNode.create({
          uuid: "next_" + uuidv1(),
          name: "next"
        });
        parent_graph.addNode(child);
        return self.setChild(child).uuid;
      }
    }

    function setParent(node, index = 0, fix = false) {
      self.parents[index] = node.uuid;

      if (!node.children.includes(self)) {
        if (fix) node.setChild(self);
      }

      return node;
    }

    function setChild(node, index = 0, fix = false) {
      self.children[index] = node.uuid;

      if (!node.parents.includes(self)) {
        node.setParent(self);
      }

      return node;
    }

    function setBranchIndex(id) {
      self.branch_index = id;
    }

    function setName(n) {
      self.name = n;
    }

    function select() {
      parent_graph.setSelected(self);
      self.selected = true;
      return self;
    }

    function deselect() {
      parent_graph.setSelected(null);
      self.selected = false;
      return self;
    }

    function remove() {
      parent_graph.removeNode(self);
    }

    return {
      remove,
      afterAttach,
      setData,
      mapInputsToParents,
      setParent,
      setChild,
      setBranchIndex,
      setName,
      select,
      deselect
    };
  });

export default GraphNode;
