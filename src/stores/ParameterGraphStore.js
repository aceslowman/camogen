import GraphNode from './NodeStore';
import uuidv1 from 'uuid/v1';

import {
    types,
    getParent,
    getSnapshot,
    getRoot
} from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from './utils/Coordinate';
import Counter from './operators/inputs/Counter';
import MIDI from './operators/inputs/MIDI';
import Add from './operators/math/Add';
import Graph from './GraphStore';

// TODO: ideally this lives in it's own file, but there are circular dependency issues
// that are unresolved with mobx-state-tree late
const parameterGraph = types
    .model("ParameterGraph", {})
    .actions(self => {
        let parent_param;
        let parent_shader;

        function afterAttach() {
            parent_param = getParent(self);
            parent_shader = getParent(self, 6).data;
            self.addNode();
            self.update();
            
            // TODO: should be toggleable
            parent_shader.addToParameterUpdateGroup(self)
        }

        function getOperator(name) {
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
                // case 'Subtract':
                //     operator = Subtract.create({
                //         uuid: uuidv1(),
                //         name: '-'
                //     })
                //     break;
                // case 'Divide':
                //     operator = Divide.create({
                //         uuid: uuidv1(),
                //         name: '/'
                //     })
                //     break;
                // case 'Multiply':
                //     operator = Multiply.create({
                //         uuid: uuidv1(),
                //         name: '*'
                //     })
                //     break;
                // case 'Modulus':
                //     operator = Modulus.create({
                //         uuid: uuidv1(),
                //         name: '%'
                //     })
                //     break;
                // case 'Sin':
                //     operator = Sin.create({
                //         uuid: uuidv1(),
                //         name: 'Sin'
                //     })
                //     break;
                // case 'Cos':
                //     operator = Cos.create({
                //         uuid: uuidv1(),
                //         name: 'Cos'
                //     })
                //     break;
                // case 'Tan':
                //     operator = Tan.create({
                //         uuid: uuidv1(),
                //         name: 'Tan'
                //     })
                //     break;
                default:
                    break;
            }

            return operator;
        }

        function setSelectedByName(name) {
            if (!self.selectedNode) self.selectedNode = self.root;
            let op = getOperator(name);
            if(op) {
                self.selectedNode.setData(op);
                self.update();
            } else {
                console.error('operator was not found!');
            }            
        }

        /*
            afterUpdate(queue)
        */
        function afterUpdate() {
            // this allows the parameter to remain unchanged 
            // when the graph is empty. 
            if(self.nodes.size <= 1) return;
            
            let total = 0;

            self.queue.forEach(subqueue => {
                subqueue.forEach(node => {
                    let subtotal = 0;
                    // if not root node
                    if (node.data) {
                        subtotal = node.data.update();
                    }
                    total += subtotal;
                })
                parent_param.setValue(total);
            });
        }

        function beforeDestroy() {
            console.log('about to delete param graph')
        }

        return {
            beforeDestroy,
            afterAttach,
            afterUpdate,
            getOperator,
            setSelectedByName,
        }
    })


// const ParameterGraph = types.compose("Parameter Graph", Graph, parameterGraph);

export default types.compose("Parameter Graph", types.late(()=>Graph), parameterGraph);