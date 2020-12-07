import { types } from 'mobx-state-tree';
import {nanoid} from 'nanoid';

import Counter from './inputs/Counter';
import MIDI from './inputs/MIDI';
import Add from './math/Add';
import Subtract from './math/Subtract';
import Divide from './math/Divide';
import Multiply from './math/Multiply';
import Modulus from './math/Modulus';
import Sin from './math/Sin';
import Cos from './math/Cos';
import Tan from './math/Tan';

export const allOps = types.union(
    Counter, 
    MIDI, 
    Add, 
    Subtract, 
    Divide, 
    Multiply, 
    Modulus, 
    Sin, 
    Cos, 
    Tan
);

export const getOperator = (name) => {
    let operator = null;

    switch (name) {
        case 'Counter':
            operator = Counter.create({
                uuid: 'Counter_'+nanoid(),
                name: 'Counter'
            });
            break;
        case 'MIDI':
            operator = MIDI.create({
                uuid: 'MIDI_'+nanoid(),
                name: 'MIDI'
            })
            break;
        case 'Add':
            operator = Add.create({
                uuid: 'Add_'+nanoid(),
                name: '+'
            })
            break;
        case 'Subtract':
            operator = Subtract.create({
                uuid: 'Subtract_'+nanoid(),
                name: '-'
            })
            break;
        case 'Divide':
            operator = Divide.create({
                uuid: 'Divide_'+nanoid(),
                name: '/'
            })
            break;
        case 'Multiply':
            operator = Multiply.create({
                uuid: 'Multiply_'+nanoid(),
                name: '*'
            })
            break;
        case 'Modulus':
            operator = Modulus.create({
                uuid: 'Modulus_'+nanoid(),
                name: '%'
            })
            break;
        case 'Sin':
            operator = Sin.create({
                uuid: 'Sin_'+nanoid(),
                name: 'Sin'
            })
            break;
        case 'Cos':
            operator = Cos.create({
                uuid: 'Cos_'+nanoid(),
                name: 'Cos'
            })
            break;
        case 'Tan':
            operator = Tan.create({
                uuid: 'Tan_'+nanoid(),
                name: 'Tan'
            })
            break;
        default:
            break;
    }

    return operator;
}