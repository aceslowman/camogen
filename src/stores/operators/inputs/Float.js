import { types } from "mobx-state-tree";
import Operator from "../../OperatorStore";

const float = types
  .model("Float", {
    type: "Float",
    value: 0,
    modifier: 100
  })
  .actions(self => ({
    update: () => {
      // self.value =
        // self.modifier !== 0 ? (self.value += 1 / self.modifier) : self.value;
      return self.value;
    }
  }));

const Float = types.compose(
  Operator,
  float
);

export default Float;
