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
                uuid: 'Counter_'+uuidv1(),
                name: 'Counter'
            });
            break;
        case 'MIDI':
            operator = MIDI.create({
                uuid: 'MIDI_'+uuidv1(),
                name: 'MIDI'
            })
            break;
        case 'Add':
            operator = Add.create({
                uuid: 'Add_'+uuidv1(),
                name: '+'
            })
            break;
        case 'Subtract':
            operator = Subtract.create({
                uuid: 'Subtract_'+uuidv1(),
                name: '-'
            })
            break;
        case 'Divide':
            operator = Divide.create({
                uuid: 'Divide_'+uuidv1(),
                name: '/'
            })
            break;
        case 'Multiply':
            operator = Multiply.create({
                uuid: 'Multiply_'+uuidv1(),
                name: '*'
            })
            break;
        case 'Modulus':
            operator = Modulus.create({
                uuid: 'Modulus_'+uuidv1(),
                name: '%'
            })
            break;
        case 'Sin':
            operator = Sin.create({
                uuid: 'Sin_'+uuidv1(),
                name: 'Sin'
            })
            break;
        case 'Cos':
            operator = Cos.create({
                uuid: 'Cos_'+uuidv1(),
                name: 'Cos'
            })
            break;
        case 'Tan':
            operator = Tan.create({
                uuid: 'Tan_'+uuidv1(),
                name: 'Tan'
            })
            break;
        default:
            break;
    }

    return operator;
}