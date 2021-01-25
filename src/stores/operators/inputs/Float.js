import { types } from "mobx-state-tree";
import Operator from "../../OperatorStore";

const float = types
  .model("Float", {
    type: "Float",
    value: 1
  })
  .actions(self => ({
    update: () => {
      return self.value;
    },
    handleChange: e => {
      self.value = e;
    }
  }));

const Float = types.compose(
  Operator,
  float
);

export default Float;
