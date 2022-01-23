import { types } from "mobx-state-tree";
import Operator from "../OperatorStore";

const modulus = types
  .model("Modulus", {
    type: "Modulus",
    modifier: 0,
    value: 0,
    inputs: types.optional(types.array(types.string), ["input1", "input2"])
  })
  .actions(self => ({
    update: () => {
      let a = self.parents[0].data.update();
      let b =
        self.parents[1] && self.parents[1].data
          ? self.parents[1].data.update()
          : self.modifier;
      self.value = a % b;
      return self.value;
    }
  }));

const Modulus = types
  .compose(
    Operator,
    modulus
  )
  .named("Modulus");

export default Modulus;
