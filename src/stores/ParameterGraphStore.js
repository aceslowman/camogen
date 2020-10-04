import GraphNode from './NodeStore';
import uuidv1 from 'uuid/v1';

import { types, getParent } from "mobx-state-tree";
// import { undoManager } from './RootStore';
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
                    if (node.data) subtotal = node.data.update();
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