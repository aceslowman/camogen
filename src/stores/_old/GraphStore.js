import { observable, action, computed } from 'mobx';
import NodeStore, {GraphNode} from './NodeStore';
import uuidv1 from 'uuid/v1';
import {
    // createModelSchema,
    map,
    // getDefaultModelSchema,
    identifier,
    object,
    // custom,
    serializable,
    // serialize,
    // reference
} from "serializr"

import { types } from "mobx-state-tree";

export default class GraphStore {
    @serializable(identifier())
    @observable uuid = uuidv1();

    @serializable(map(object(NodeStore.schema)))
    @observable nodes = new Map();

    @observable parent = null;

    @observable selectedNode = null;

    @observable currentlyEditing = null;

    // NOTE: toggle to force a re-render in React
    @observable updateFlag = false;

    @observable coord_bounds = null;

    constructor(parent) {
        this.parent = parent;
    
        this.addNode().select();        
    }    

    @action clear() {
        // re-initialize the nodes map
        this.nodes.clear();
        // assure that no nodes are in editing
        this.currentlyEditing = null;
        // create root node, select it
        this.addNode().select();
        // recalculate 
        this.update(); 
    }

    /* 
        update()

        this method will calculate the branches of the
        graph structure and then call afterUpdate()
    */
    @action update() {
        let update_queue = this.calculateBranches();        
        this.afterUpdate(update_queue);   
        
        // to force a react re-render
        this.updateFlag = !this.updateFlag;
    }

    /*
        addNode(node = new NodeStore('NEW NODE', this))

        this method adds new nodes to the graph. 
        this does not assume that the node has any 
        associated data.
    */
    @action addNode(node = new NodeStore('NEW NODE', this)) {
        node.graph = this;

        this.nodes.set(node.uuid, node);
        return this.nodes.get(node.uuid)
    }

    /*
        removeSelected()
    */
    @action removeSelected() {
        this.removeNode(this.selectedNode);
    }

    /*
        removeNode(node)
    */
    @action removeNode(node) {
        if (node === this.root) return;

        /*
            if node being removed has a parent, make
            sure to reconnect those parent nodes to the
            next child node.
        */
        if (node.parents.length) {
            node.parents.forEach((parent,i) => {
                parent.children[0] = node.children[0];
                node.children[0].parents[0] = node.parents[0];
            });
        } else {
            let idx = node.children[0].parents.indexOf(node);
            console.log(idx)
            node.children[0].parents.splice(idx, 1);
        }

        this.selectedNode = node.children[0]

        node.data.onRemove();
        this.nodes.delete(node);
        
        if (this.nodes.size < 2) {
            this.clear();
        } else {
            this.update();
        }  
    }

    /*
        traverse(f = null, depthFirst = false)

        this method will crawl through the graph structure
        either depth first or breadth first.

        it's first argument is function that will be called
        during each step of the traversal.
    */
    @action traverse(f = null, depthFirst = false) {
        let result = [];
        let container = [this.root];
        let next_node;
        let distance_from_root = 0;

        while(container.length) {             
            next_node = container.shift();
            
            if(next_node) {
                result.push(next_node);
                distance_from_root = this.distanceBetween(next_node, this.root);

                if (f) f(next_node, distance_from_root);

                if(next_node.parents) {
                    container = depthFirst 
                        ? container.concat(next_node.parents) // depth first search
                        : next_node.parents.concat(container) // breadth first search
                } 
            }
        }

        return result;
    }

    @action distanceBetween(a, b) {
        let node = a;
        let count = 0;

        while (node !== b && node.children[0]) {
            node = node.children[0];
            count++;
        }

        return count;
    }

    @action calculateBranches() {
        let current_branch = 0;
        let queue = [];

        this.traverse(next_node => {
            next_node.branch_index = null;
            if (next_node.data) {

                // if we hit the topmost node
                if (!next_node.hasConnectedParents) {  
                    let t_node = next_node;
                    t_node.branch_index = current_branch;
                    queue.push(t_node);

                    // propogate the new branch down the chain
                    // until it hits a node already with a branch_index
                    while (t_node.firstChild && t_node.firstChild.branch_index === null) {
                        t_node.firstChild.branch_index = current_branch;
                        t_node = t_node.firstChild;
                        queue.push(t_node);
                    }

                    current_branch++;
                }
            }
        });

        return queue;
    }

    @computed get root() {
        let node = this.nodes.values().next().value;

        while (node && node.children[0]) {
        // while (node && node.children.length) {
            node = node.children[0];
        }

        return node;
    }

    /*
        calculateCoordinates()

        for visualization
    */
    @action calculateCoordinates() {
        let used_coords = [];
        let x = 0;
        let y = 0;

        return this.traverse((node, dist) => {
            y = dist;
            node.coordinates.x = x;
            node.coordinates.y = y;

            if(!node.parents.length) {
                x++;
            }

            if(used_coords.find((coord) => coord.x === x && coord.y === y)) {
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
    @action calculateCoordinateBounds() {
        let max_x = 0;
        let max_y = 0;

        this.nodes.forEach((v) => {
            max_x = v.coordinates.x > max_x ? v.coordinates.x : max_x;
            max_y = v.coordinates.y > max_y ? v.coordinates.y : max_y;
        });

        this.coord_bounds = {
            x: max_x,
            y: max_y
        };

        return this.coord_bounds;
    }
}

const Coordinate = types
    .model("Coordinate", {
        x: types.optional(types.number, 0),
        y: types.optional(types.number, 0)
    })

const Graph = types
    .model("Graph", {
        uuid: types.identifier,
        nodes: types.map(GraphNode),
        selectedNode: types.maybe(types.reference(GraphNode)),
        currentlyEditing: types.maybe(types.reference(GraphNode)),
        coord_bounds: types.optional(Coordinate, {x: 0, y: 0}),
    })
    .views(self => ({
        get root() {
            let node = self.nodes.values().next().value;

            while (node && node.children[0]) {
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
        function afterCreate() {
            addNode().select();
        }

        /*
            clear()
        */
        function clear() {
            // re-initialize the nodes map
            self.nodes.clear();
            // assure that no nodes are in editing
            self.currentlyEditing = null;
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
            let update_queue = self.calculateBranches();
            self.afterUpdate(update_queue);

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
            self.nodes.set(node.uuid, node);
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

        function setSelected(node) {
            self.selectedNode = node;
        }

        function setEditing(node) {
            self.currentlyEditing = node;
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
                node.parents.forEach((parent, i) => {
                    parent.children[0] = node.children[0];
                    node.children[0].parents[0] = node.parents[0];
                });
            } else {
                let idx = node.children[0].parents.indexOf(node);
                console.log(idx)
                node.children[0].parents.splice(idx, 1);
            }

            self.selectedNode = node.children[0]

            node.data.onRemove();
            self.nodes.delete(node);

            if (self.nodes.size < 2) {
                self.clear();
            } else {
                self.update();
            }
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
        */
        function calculateBranches() {
            let current_branch = 0;
            let queue = [];

            self.traverse(next_node => {
                next_node.branch_index = undefined;
                if (next_node.data) {

                    // if we hit the topmost node
                    if (!next_node.hasConnectedParents) {
                        let t_node = next_node;
                        t_node.branch_index = current_branch;
                        queue.push(t_node);

                        // propogate the new branch down the chain
                        // until it hits a node already with a branch_index
                        while (t_node.firstChild && t_node.firstChild.branch_index === undefined) {
                            t_node.firstChild.branch_index = current_branch;
                            t_node = t_node.firstChild;
                            queue.push(t_node);
                        }

                        current_branch++;
                    }
                }
            });

            return queue;
        }

        /*
            calculateCoordinates()

            for visualization
        */
        function calculateCoordinates() {
            let used_coords = [];
            let x = 0;
            let y = 0;

            return self.traverse((node, dist) => {
                y = dist;
                node.coordinates.x = x;
                node.coordinates.y = y;

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
            afterCreate,
            clear,
            update,
            appendNode,
            addNode,
            setEditing,
            setSelected,
            removeSelected,
            removeNode,
            traverse,            
            calculateBranches,
            calculateCoordinates,
            calculateCoordinateBounds,
        }
    })

export { Graph }