import GraphNode from './NodeStore';
import uuidv1 from 'uuid/v1';

import { types, getRoot, getSnapshot, applySnapshot, getParent } from "mobx-state-tree";
import { undoManager } from './RootStore';
import Coordinate from './utils/Coordinate';
import Operator from './OperatorStore';
import Counter from './inputs/Counter';

const Graph = types
    .model("Graph", {
        uuid: types.identifier,
        nodes: types.map(GraphNode),
        selectedNode: types.maybe(types.safeReference(GraphNode)),
        coord_bounds: types.optional(Coordinate, {x: 0, y: 0}),
        updateFlag: false,
    })
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
        }
    }))
    .actions(self => {
        /*
            afterCreate()
        */
        function afterAttach() {            
            // addNode().select();
            // self.update();
        }

        /*
            clear()
        */
        function clear() {
            // re-initialize the nodes map
            self.nodes.clear();
            // create root node, select it
            self.addNode().select();
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
            self.calculateCoordinates();
            self.calculateCoordinateBounds();

            // send each individual branch on to afterUpdate
            self.afterUpdate(render_queues);

            // to force a react re-render
            self.updateFlag = !self.updateFlag;
        }

        /*
            addNode(node = new NodeStore('NEW NODE', self))

            self method adds new nodes to the graph. 
            self does not assume that the node has any 
            associated data.
        */
        function addNode(node = GraphNode.create({uuid: 'add_'+uuidv1()})) {            
            self.nodes.put(node);
            // self.update(); // TEMP
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
                        if(i == 0) return;
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

            while (container.length) {
                next_node = container.shift();

                if (next_node) {
                    result.push(next_node);
                    distance_from_root = self.distanceBetween(next_node, self.root);

                    if (f) f(next_node, distance_from_root);

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
            let current_branch = 0;
            let render_queues = [];

            self.traverse(next_node => {
                next_node.branch_index = undefined;

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
                }    
            });

            return render_queues;
        }

        /*
            calculateCoordinates()

            for visualization
            TODO: collapse into traverse()
        */
        function calculateCoordinates() {
            let used_coords = [];
            let x = 0;
            let y = 0;

            return self.traverse((node, dist) => {
                y = dist;

                node.coordinates.set(x,y);

                if (!node.parents.length) {
                    x++;
                }

                if (used_coords.find((coord) => coord.x === x && coord.y === y)) {
                    console.log('node space occupied! shift now!')
                }

                used_coords.push(node.coordinates);
            });
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
            afterAttach,
            clear,
            update,
            appendNode,
            addNode,
            setSelected,
            removeSelected,
            removeNode,
            traverse,              
            calculateBranches: () => undoManager.withoutUndo(calculateBranches),
            calculateCoordinates: () => undoManager.withoutUndo(calculateCoordinates),
            calculateCoordinateBounds: () => undoManager.withoutUndo(calculateCoordinateBounds),
        }
    })

// currently here because of circular dependency issues
const parameterGraph = types
    .model("ParameterGraph", {})
    .actions(self => {
        let parent_param;

        function afterAttach() {
            parent_param = getParent(self);
            console.log('parent_param', parent_param)
            self.addNode();
            self.update();
        }

        function getOperator(name) {
            let operator;

            try {
                switch (name) {
                    case 'Counter':
                        operator = Counter.create({
                            uuid: uuidv1(),
                            name: 'Counter'
                        });
                        break;
                
                    default:
                        break;
                }
                return operator;
            } catch (err) {
                console.error('operators have not been loaded', err)
            }
        }

        function setSelectedByName(name) {
            if (!self.selectedNode) self.selectedNode = self.root;
            let op = getOperator(name);
            console.log(op)
            self.selectedNode.setData(op);
            self.update();
        }

        /*
            afterUpdate(queue)
        */
        function afterUpdate(queue) {
            recalculate(queue);
        }

        function recalculate(queue) {
            let v = 0;
            
            queue.forEach(subqueue => {
                subqueue.forEach(node => {
                    // if not root node
                    if (node.data) v = node.data.update(v);

                    parent_param.setValue(v);
                })
            });
        }

        return {
            afterAttach,
            getOperator,
            setSelectedByName,
            afterUpdate,
            recalculate,
        }
    })


export const ParameterGraph = types.compose("Parameter Graph", parameterGraph, Graph);
export default Graph;