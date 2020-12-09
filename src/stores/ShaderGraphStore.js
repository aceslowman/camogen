import Graph from "./GraphStore";
import {
  types,
  getRoot,
  getSnapshot,
  applySnapshot,
  getParent
} from "mobx-state-tree";
import Shader from "./ShaderStore";

// special shaders
import WebcamInput from "./shaders/inputs/WebcamInput";
import ImageInput from "./shaders/inputs/ImageInput";
import TextInput from "./shaders/inputs/TextInput";

let shaderGraph = types.model("ShaderGraph", {}).actions(self => {
  let state_root;
  let parent_scene;

  function afterAttach() {
    state_root = getRoot(self);
    parent_scene = getParent(self);
  }

  /*
            afterUpdate(queue)

            after graph updates, the shader graph updates targets
            and syncs the shaders with the targets

            accepts an array of arrays, representing each target and it's 
            render queue.
        */
  function afterUpdate() {
    self.queue.forEach((subqueue, branch_id) => {
      /*
                    assign targets to shaders

                    note: seems like there is room for refactoring and making
                    the logic of this clearer.
                */
      subqueue.forEach(node => {
        if (node.data) {
          // if there are targets and the necessary one is available
          if (
            parent_scene.targets.length &&
            parent_scene.targets[node.branch_index]
          ) {
            node.data.setTarget(parent_scene.targets[node.branch_index]);
          } else {
            // otherwise, add target
            node.data.setTarget(parent_scene.addTarget());
          }

          if (!node.data.ready) {
            node.data.init();
          }
        }
      });

      // if target exists, assign full queue
      if (parent_scene.targets[branch_id])
        parent_scene.targets[branch_id].setRenderQueue(subqueue);
    });
  }

  function getShaderByName(name) {
    let data, shader;

    // special case for webcam, image, and video shaders?
    switch (name) {
      case "WebcamInput":
        return WebcamInput.create();
      case "ImageInput":
        return ImageInput.create();
      case "TextInput":
        return TextInput.create();
      default:
        try {
          data = state_root.shader_collection.getByName(name).data;
          shader = Shader.create();
          applySnapshot(shader, getSnapshot(data));
          return shader;
        } catch (err) {
          console.error("shaders have not been loaded", err);
        }
    }
  }

  function setSelectedByName(name, collection = null) {
    if (!self.selectedNode) self.selectedNode = self.root;
    let shader = getShaderByName(name);
    // shader.collection = collection;
    // collection is experimental argument
    // console.log('collection',collection)    
    self.selectedNode.setData(shader);
    self.update(); // fixed issue where bounds weren't updating
  }

  return {
    afterAttach,
    afterUpdate,
    getShaderByName,
    setSelectedByName
  };
});

const ShaderGraph = types
  .compose(
    Graph,
    shaderGraph
  )
  .named("ShaderGraph");

export default ShaderGraph;
