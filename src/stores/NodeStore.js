import Shader from "./ShaderStore";
import { undoManager } from "./GraphStore";
import { types, getParent, getSnapshot } from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from "./utils/Coordinate";
import { nanoid } from "nanoid";
import { allOps } from "./operators";
import SketchInput from "./shaders/inputs/SketchInput";
import WebcamInput from "./shaders/inputs/WebcamInput";
import ImageInput from "./shaders/inputs/ImageInput";
import TextInput from "./shaders/inputs/TextInput";

// NOTE: rearranged ImageInput and Shader, keep an eye on this for issues
const PossibleData = types.union(
  {
    dispatcher: snap => {
      if (snap) {
        if (snap.type === "Shader") return Shader;
        if (snap.type === "SketchInput") return SketchInput;
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
  SketchInput,
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
    coordinates: types.optional(Coordinate, { x: 0, y: 0 }),
    bypass: false
  })
  .volatile(self => ({
    branch_index: 0,
    trunk_distance: 0,
    parent_graph: null
  }))
  .views(self => ({
    get isActiveSelection() {
      return self.parent_graph.selectedNode === self;
    },

    get isSelected() {
      return self.parent_graph.clipboard.selection.includes(self)
        ? true
        : false;
    }
  }))
  .actions(self => ({
    afterAttach: () => (self.parent_graph = getParent(self, 2)),

    setBypass: b => (self.bypass = b),

    toggleBypass: () => (self.bypass = !self.bypass),

    setData(data) {
      self.data = data;
      self.name = data.name;

      // extract uniforms, map inputs/outputs
      self.parent_graph.update();
      self.parent_graph.afterUpdate();
      self.mapInputsToParents();
    },

    mapInputsToParents: () => {
      if (!self.data) return;

      // if there are no inputs to map...
      if (!self.data.inputs.length) {
        // remove all upstream parents
        self.parents.forEach((parent, i) => {
          self.parent_graph.removeNode(parent);
        });
        self.parents = [];
      }

      // for each input in the shader...
      self.data.inputs.forEach((e, i) => {
        // if a new input was added
        if (i >= self.parents.length) {
          let parent = GraphNode.create({
            uuid: nanoid(),
            name: e
          });

          self.parent_graph.addNode(parent);
          self.setParent(parent, i, true);
        }

        self.parent_graph.update();
      });

      // add new node if no children are present
      if (!self.children.length) {
        let child = GraphNode.create({
          uuid: "next_" + nanoid(),
          name: "next"
        });

        self.parent_graph.addNode(child);
        return self.setChild(child).uuid;
      }
    },

    setParent: (node, index = 0, fix = false) => {
      if (index < self.parents.length) {
        self.parents[index] = node.uuid;
      } else {
        self.parents.push(node.uuid);
      }

      if (!node.children.includes(self)) {
        if (fix) node.setChild(self);
      }

      return node;
    },

    setChild: (node, index = 0, fix = false) => {
      self.children[index] = node.uuid;

      if (!node.parents.includes(self)) {
        node.setParent(self);
      }

      return node;
    },

    swapData: target => {
      /*
        this makes it possible to move a node up or down the tree
      */
      let selfcopy = getSnapshot(self.data);
      let targetcopy = getSnapshot(target.data);

      target.setData(selfcopy);
      self.setData(targetcopy);

      self.parent_graph.update();
      self.parent_graph.afterUpdate();

      self.data.init();
      target.data.init();

      // extract uniforms, map inputs/outputs
      self.mapInputsToParents();
      target.mapInputsToParents();
    },

    select: () => {
      self.parent_graph.clipboard.select(self);
      return self;
    },

    deselect: () => {
      self.parent_graph.clipboard.removeSelection(self);
      return self;
    },

    setChildren: children => (self.children = children),
    setParents: parents => (self.parents = parents),
    setBranchIndex: idx => (self.branch_index = idx),
    setName: name => (self.name = name)
  }));

export default GraphNode;
