import { NodeData } from "../NodeDataStore";
import { getParent, types } from "mobx-state-tree";

let operator = types
  .model("Operator", {
    uuid: types.identifier,
    value: types.maybe(types.union(types.number, types.string, types.boolean)),
    modifier: types.maybe(
      types.union(types.number, types.string, types.boolean)
    )
  })
  .volatile(self => ({
    parents: null
  }))
  .actions(self => ({
    afterAttach: () => {
      self.parents = getParent(self).parents;
    },
    handleChange: e => {
      self.modifier = e;
    },
    onRemove: () => {}
  }));

const Operator = types
  .compose(
    NodeData,
    operator
  )
  .named("Operator");

export default Operator;
