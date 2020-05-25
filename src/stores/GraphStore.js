import { observable, action, decorate, computed } from 'mobx';
import Node from './NodeStore';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
    map,
    identifier,
    reference,
    deserialize,
} from "serializr"

function findNodeById(uuid, callback) {
    // let result = this.nodes.find((item) => item.uuid !== uuid);
    let result = "";
    callback(null, result);
}

class GraphStore {
    uuid   = uuidv1();
    active = true;
    parent = null;
    activeNode = null;

    // NOTE: toggle to force a re-render in React
    updateFlag = false;

    nodes = {};

    constructor(parent, node = new Node(this, null, 'ROOT NODE')) {
        this.parent = parent;
        this.addNode(node).select();        
    }    

    update() {
        let update_queue = this.calculateBranches();        
        this.afterUpdate(update_queue);

        // add new node at end if necessary
        if(this.root.data) {
            this.root.addChild().select(true);
        }            
        
        this.updateFlag = !this.updateFlag;
    }

    addNode(node = new Node(this, null, 'ROOT NODE')) {
        node.graph = this;
        
        this.nodes = {
            ...this.nodes,
            [node.uuid]: node
        }

        return node;
    }

    // addNodeToEnd(node = new Node(this, null, 'ROOT NODE')) {
    //     this.root.setData(node.data);             


    //     if (this.activeNode) this.activeNode.deselect();
    //     node.select();


    //     return node;
    // }

    removeNode(uuid) {
        console.log(this.nodes[uuid])
        // search through nodes and remove

        delete this.nodes[uuid]
        this.update();
    }

    traverse(f = null, depthFirst = false) {
        let out = [];
        let container = [this.root];
        let next_node;
        let distance_from_root = 0;

        while(container.length) {             
            next_node = container.shift();
            out.push(next_node.uuid);
            
            if(next_node) {
                distance_from_root = this.distanceBetween(next_node, this.root);

                if (f) f(next_node, distance_from_root);

                if(next_node.parents) {
                    container = depthFirst 
                        ? container.concat(next_node.parents) // depth first search
                        : next_node.parents.concat(container) // breadth first search
                }                          
            }
        }

        return out;
    }

    distanceBetween(a, b) {
        let node = a;
        let count = 0;

        while (node !== b && node.children[0]) {
            node = node.children[0];
            count++;
        }

        return count;
    }

    calculateBranches() {
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

    afterUpdate = (t) => {}

    getNodeById(uuid) {
        let node = this.nodes[uuid];

        if(!node) console.error(`node was not found!`, uuid);
        return node;
    }

    get root() {
        let keys = Object.keys(this.nodes);        
        let node = this.nodes[keys[0]]; 

        while(node && node.children[0]){
            node = node.children[0];       
        }

        return node;
    }

    get nodeCount() {
        return Object.keys(this.nodes).length;
    }
}

decorate(GraphStore, {
    uuid:              observable,
    nodes:             observable,
    activeNode:        observable,
    updateFlag:        observable,  
    update:            action,
    afterUpdate:       action,
    addNodeToEnd:      action,
    traverse:          action,
    distanceBetween:   action,
    calculateBranches: action,
    getNodeById:       action,
    removeNode:        action,
    root:              computed,
    nodeCount:         computed,
});

createModelSchema(GraphStore, {
    uuid:    identifier(),
    nodes:   map(),
    root:    reference(Node, findNodeById),
}, c => {
    let p = c.parentContext.target;
    console.log('Graph store factory', p)
    return new GraphStore(p);
});

export default GraphStore;