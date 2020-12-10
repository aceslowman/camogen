import { types } from "mobx-state-tree";
import Operator from "../../OperatorStore";

const sin = types
  .model("Sin", {
    type: "Sin",
    value: 0,
    modifier: 0,
    inputs: types.optional(types.array(types.string), ["input1"])
  })
  .actions(self => ({
    update: () => {
      if (!self.parents[0] || !self.parents[0].data) return 0;

      let a = self.parents[0].data.update();
      self.value = Math.sin(a);
      return self.value;
    }
  }));

const Sin = types
  .compose(
    Operator,
    sin
  )
  .named("Sin");

export default Sin;
