import { types } from "mobx-state-tree";
import Operator from "./OperatorStore";

const thru = types
  .model("Thru", {
    type: "Thru",
    value: 0,
    modifier: 0,
    inputs: types.optional(types.array(types.string), ["input1"])
  })
  .actions(self => ({
    update: () => {
      if (!self.parents[0] || !self.parents[0].data) return 0;

      let a = self.parents[0].data.update();
      
      return a;
    }
  }));

const Thru = types
  .compose(
    Operator,
    thru
  )
  .named("Thru");

export default Thru;