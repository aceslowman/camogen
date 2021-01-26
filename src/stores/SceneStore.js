import { nanoid } from "nanoid";
import { getSnapshot, types, destroy } from "mobx-state-tree";
import ShaderGraph from "./ShaderGraphStore";
import Target from "./TargetStore";
import { OperatorGraph } from "./GraphStore";

const Scene = types
  .model("Scene", {
    shaderGraph: types.maybe(ShaderGraph),
    targets: types.array(Target)
  })
  .actions(self => ({
    afterAttach: () => {
      self.shaderGraph = ShaderGraph.create({ uuid: nanoid() });

      /*
          add uv shader by default

          likely to be replaced with
          single loaded snapshot in RootScene
      */
      self.shaderGraph.addNode().select();
      // self.shaderGraph.setSelectedByName('WebcamInput');
      // self.shaderGraph.setSelectedByName('TextInput');
      // self.shaderGraph.setSelectedByName("SketchInput");
      // self.shaderGraph.setSelectedByName("ImageInput");
      self.shaderGraph.setSelectedByName("UV");
      self.shaderGraph.root.select();
      self.shaderGraph.setSelectedByName("Glyph");
      self.shaderGraph.root.select();
      //       self.shaderGraph.setSelectedByName("HSV2RGB");
      //       self.shaderGraph.root.select();

      self.shaderGraph.update();
      // self.shaderGraph.history.clear();
    },

    addTarget: (target = Target.create()) => {
      self.targets.push(target);
      return target;
    },

    removeTarget: target => {
      self.targets = self.targets.filter(item => item !== target);
    },

    clear: () => {
      self.shaderGraph.clear();
      self.targets = [];
    }
  }));

export default Scene;
