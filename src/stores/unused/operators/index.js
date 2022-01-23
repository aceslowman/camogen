import { types } from "mobx-state-tree";
import { nanoid } from "nanoid";

import Counter from "./inputs/Counter";
import MIDI from "./inputs/MIDI";
import Float from "./inputs/Float";
import Add from "./math/Add";
import Subtract from "./math/Subtract";
import Divide from "./math/Divide";
import Multiply from "./math/Multiply";
import Modulus from "./math/Modulus";
import Sin from "./math/Sin";
import Cos from "./math/Cos";
import Tan from "./math/Tan";
import Thru from "./Thru";

// MAIN OPERATOR LIST
export const Operators = [
  Float,
  Counter,
  MIDI,
  Add,
  Subtract,
  Divide,
  Multiply,
  Modulus,
  Sin,
  Cos,
  Tan,
  Thru
];

export const allOps = types.union(...Operators);

export const getOperator = name => {
  let operator = null;

  Operators.forEach((model, i) => {
    if (name === model.name) {
      operator = model.create({
        uuid: name + "_" + nanoid(),
        name: name
      });
      
      return false;
    }
  });

  return operator;
};
