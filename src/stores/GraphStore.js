import GraphNode from './NodeStore';
import uuidv1 from 'uuid/v1';

import { types, getParent } from "mobx-state-tree";
// import { undoManager } from './RootStore';
import Coordinate from './utils/Coordinate';
import Counter from './operators/inputs/Counter';
import MIDI from './operators/inputs/MIDI';
import Add from './operators/math/Add';

const Graph = types
    .model("Graph", {
        uuid: types.identifier,
        nodes: types.map(GraphNode),
        selectedNode: types.maybe(types.safeReference(GraphNode)),
        coord_bounds: types.optional(Coordinate, {x: 0, y: 0}),
    })
    .volatile(self => ({
        queue: []
    }))
    .views(self => ({
        get root() {
            let node = self.nodes.values().next().value;

            while (node && node.children.length) {
                node = node.children[0];
            }

            return node;
        },

        distanceBetween(a, b) {
            let node = a;
            let count = 0;

            while (node !== b && node.children[0]) {
                node = node.children[0];
                count++;
            }

            return count;
        },

        distanceFromTrunk(a) {
            let node = a;
            let count = 0;

            while (node.children[0]) {
                
                if(node.children[0].parents.length > 1) {
                    if (node.children[0].parents[0] !== node) {
                        count++;
                    }
                }
                
                node = node.children[0];
            }

            return count;
        }


    }))
    .actions(self => {

        /*
            clear()
        */
        function clear() {
            console.log('clearing graph')
            // TODO: currently not working when subgraphs are present!
            // TODO: what if I cleared the graph from the root up?
            // re-initialize the nodes map
            self.nodes.clear();

            // create root node, select it
            self.addNode();
            self.root.select();
            // recalculate 
            self.update();
        }

        /* 
            update()

            self method will calculate the branches of the
            graph structure and then call afterUpdate()
        */
        function update() {
            let render_queues = calculateBranches();

            // calculate info for visualization
            self.calculateCoordinateBounds();

            self.queue = render_queues;
        }

        /*
            addNode(node = new NodeStore('NEW NODE', self))

            self method adds new nodes to the graph. 
            self does not assume that the node has any 
            associated data.
        */
        function addNode(node = GraphNode.create({uuid: 'add_'+uuidv1()})) {            
            self.nodes.put(node);
            return self.nodes.get(node.uuid)
        }

        /*
            appendNode(node = new GraphNode('empty'))

            replaced root node with provided node and
            create new child (which will become the next
            root node)

            1. set root
            2. create child
        */
        function appendNode(node = GraphNode.create({uuid: 'append_'+uuidv1()})) {
            let current_root = self.root; 
            let new_node = self.addNode(node);
            current_root.setChild(new_node);
        }

        /*
            setSelected(node)
        */
        function setSelected(node) {
            self.selectedNode = node;
        }

        /*
            removeSelected()
        */
        function removeSelected() {
            self.removeNode(self.selectedNode);
        }

        /*
            removeNode(node)
        */
        function removeNode(node) {
            if (node === self.root) return;

            /*
                if node being removed has a parent, make
                sure to reconnect those parent nodes to the
                next child node.
            */
            if (node.parents.length) {

                /* 
                    if first child AND deleted node are multi-input
                    is multi-input, reassign
                */
                if(node.children[0].parents.length > 1 && node.parents.length > 1) {
                    node.parents.forEach((parent, i) => {
                        node.children[0].parents[i] = node.parents[i];
                    });
                } else { // otherwise, collapse and map first child to first parent                    
                    node.parents[0].children[0] = node.children[0];
                    node.children[0].parents[0] = node.parents[0];

                    // remove all pruned parents
                    node.parents.forEach((parent,i) => {
                        if(i === 0) return;
                        if(parent.data) parent.data.onRemove();
                        self.nodes.delete(parent.uuid)
                    })
                }
            } else {        
                let idx = node.children[0].parents.indexOf(node);
                node.children[0].parents.splice(idx, 1);   
            }

            node.children[0].mapInputsToParents();

            self.selectedNode = node.children[0]
            if(node.data) node.data.onRemove();
            self.nodes.delete(node.uuid);

            self.update();
        }

        /*
            traverse(f = null, depthFirst = false)

            self method will crawl through the graph structure
            either depth first or breadth first.

            it's first argument is function that will be called
            during each step of the traversal.
        */
        function traverse(f = null, depthFirst = false) {
            let result = [];
            let container = [self.root];
            let next_node;
            let distance_from_root = 0;
            let distance_from_trunk = 0;

            while (container.length) {
                next_node = container.shift();

                if (next_node) {
                    result.push(next_node);
                    distance_from_root = self.distanceBetween(next_node, self.root);
                    distance_from_trunk = self.distanceFromTrunk(next_node);

                    if (f) f(next_node, distance_from_root, distance_from_trunk);

                    if (next_node.parents) {
                        container = depthFirst ?
                            container.concat(next_node.parents) // depth first search
                            :
                            next_node.parents.concat(container) // breadth first search
                    }
                }
            }

            return result;
        }

        /* 
            calculateBranches()

            returns an array of queues, by branch_id
        */
        function calculateBranches() {
            let x = 0;

            let current_branch = 0;
            let render_queues = [];

            self.traverse((next_node, d_root, d_trunk) => {
                next_node.branch_index = undefined;
                next_node.trunk_distance = d_trunk;
                next_node.coordinates.set(x, d_root)

                // if we hit the topmost node
                if (!next_node.parents.length) {
                    let t_node = next_node;
                    t_node.setBranchIndex(current_branch);

                    if (current_branch >= render_queues.length) {
                        render_queues.push([]);
                    }

                    // only add to render queue if there is data to process
                    if(t_node.data) render_queues[current_branch].push(t_node);

                    // propogate the new branch down the chain
                    // until it hits a node already with a branch_index
                    while (t_node.children.length && t_node.children[0].branch_index === undefined) {
                        t_node.children[0].setBranchIndex(current_branch);
                        t_node = t_node.children[0];

                        if (current_branch >= render_queues.length) {
                            render_queues.push([]);
                        }

                        if (t_node.data) render_queues[current_branch].push(t_node);
                    }

                    current_branch++;
                    x++;
                }    
            });

            return render_queues;
        }

        /*
            calculateCoordinateBounds()

            returns an object representing the size of the graph,
            for centering, scaling, and positioning visualization
        */
        function calculateCoordinateBounds() {
            let max_x = 0;
            let max_y = 0;

            self.nodes.forEach((v) => {
                max_x = v.coordinates.x > max_x ? v.coordinates.x : max_x;
                max_y = v.coordinates.y > max_y ? v.coordinates.y : max_y;
            });

            self.coord_bounds = {
                x: max_x,
                y: max_y
            };

            return self.coord_bounds;
        }

        return {
            clear,
            update,
            appendNode,
            addNode,
            setSelected,
            removeSelected,
            removeNode,
            traverse,         
            calculateBranches,
            calculateCoordinateBounds,
            // calculateBranches: () => undoManager.withoutUndo(calculateBranches),
            // calculateCoordinateBounds: () => undoManager.withoutUndo(calculateCoordinateBounds),
        }
    })

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

        return {
            afterAttach,
            afterUpdate,
            getOperator,
            setSelectedByName,
        }
    })


export const ParameterGraph = types.compose("Parameter Graph", Graph, parameterGraph);
export default Graph;