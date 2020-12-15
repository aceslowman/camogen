import Shader from "./ShaderStore";
import { types, getParent, getSnapshot } from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from "./utils/Coordinate";
import { nanoid } from "nanoid";
import { allOps } from "./operators";
// import { allInputs } from "./inputs";
// should move inputs to similar allInputs
import WebcamInput from "./shaders/inputs/WebcamInput";
import ImageInput from "./shaders/inputs/ImageInput";
import TextInput from "./shaders/inputs/TextInput";

// NOTE: rearranged ImageInput and Shader, keep an eye on this for issues
const PossibleData = types.union(
  {
    dispatcher: snap => {
      if (snap) {
        if (snap.type === "Shader") return Shader;
        if (snap.type === "WebcamInput") return WebcamInput;
        if (snap.type === "ImageInput") return ImageInput;
        if (snap.type === "TextInput") return TextInput;
        return allOps;
      } else {
        return Shader;
      }
    }
  },
  Shader,
  allOps,
  ImageInput,
  WebcamInput,
  TextInput
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

    function setData(data) {
      self.data = data;
      self.name = data.name;

      // extract uniforms, map inputs/outputs
      parent_graph.update();
      parent_graph.afterUpdate();
      self.mapInputsToParents();
    }

    function mapInputsToParents() {
      if (!self.data) return;

      // if there are no inputs to map...
      if (!self.data.inputs.length) {        
        // remove all upstream parents
        self.parents.forEach((parent, i) => {
          parent_graph
            .traverseFrom(parent, null, true)
            .map(e => e.uuid)
            .reverse()
            .forEach(e => parent_graph.nodes.delete(e));
        });
        
        self.parents = [];
      }

      // add new parent
      self.data.inputs.forEach((e, i) => {
        // add parent if necessary
        if (i >= self.parents.length) {
          let parent = GraphNode.create({
            uuid: nanoid(),
            name: e
          });

          parent_graph.addNode(parent);
          self.setParent(parent, i, true);
        }
      });

      // add new node if no children are present
      if (!self.children.length) {
        let child = GraphNode.create({
          uuid: "next_" + nanoid(),
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

    /*
      this makes it possible to move a node up or down the tree
    */
    function swapData(target) {
      let selfcopy = getSnapshot(self.data);
      let targetcopy = getSnapshot(target.data);

      target.setData(selfcopy);
      self.setData(targetcopy);

      parent_graph.update();
      parent_graph.afterUpdate();

      self.data.init();
      target.data.init();

      // extract uniforms, map inputs/outputs
      self.mapInputsToParents();
      target.mapInputsToParents();
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
    
    const setChildren = children => self.children = children;
    const setParents = parents => self.parents = parents;
    const setBranchIndex = idx => self.branch_index = idx;
    const setName = name => self.name = name;

    return {
      afterAttach,
      setData,
      swapData,
      mapInputsToParents,
      setParent,
      setChild,
      setParents,
      setChildren,
      setBranchIndex,
      setName,
      select,
      deselect
    };
  });

export default GraphNode;
