import { types } from 'mobx-state-tree';
import uuidv1 from 'uuid/v1';

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
                uuid: uuidv1(),
                name: 'Counter'
            });
            break;
        case 'MIDI':
            operator = MIDI.create({
                uuid: uuidv1(),
                name: 'MIDI'
            })
            break;
        case 'Add':
            operator = Add.create({
                uuid: uuidv1(),
                name: '+'
            })
            break;
        case 'Subtract':
            operator = Subtract.create({
                uuid: uuidv1(),
                name: '-'
            })
            break;
        case 'Divide':
            operator = Divide.create({
                uuid: uuidv1(),
                name: '/'
            })
            break;
        case 'Multiply':
            operator = Multiply.create({
                uuid: uuidv1(),
                name: '*'
            })
            break;
        case 'Modulus':
            operator = Modulus.create({
                uuid: uuidv1(),
                name: '%'
            })
            break;
        case 'Sin':
            operator = Sin.create({
                uuid: uuidv1(),
                name: 'Sin'
            })
            break;
        case 'Cos':
            operator = Cos.create({
                uuid: uuidv1(),
                name: 'Cos'
            })
            break;
        case 'Tan':
            operator = Tan.create({
                uuid: uuidv1(),
                name: 'Tan'
            })
            break;
        default:
            break;
    }

    return operator;
}