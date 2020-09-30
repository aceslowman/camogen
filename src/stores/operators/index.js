import { types } from 'mobx-state-tree';
import Counter from './inputs/Counter';
import MIDI from './inputs/MIDI';
import Add from './math/Add';

export const allOps = types.union(
    Counter, 
    MIDI, 
    Add, 
    /* 
    Subtract, 
    Divide, 
    Multiply, 
    Modulus, 
    Sin, 
    Cos, 
    Tan
    */ 
);