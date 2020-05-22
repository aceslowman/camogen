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

    nodes = {};

    constructor(parent) {
        this.parent = parent;
    }    

    addNodeToEnd(node) { 
        console.groupCollapsed('adding node', node.name);
        // attach node to root (if inlets exist)
        console.log('parents',node.parents)

        if(this.root)        
            this.root.connectChild(node,0);  
                        
        this.nodes = {
            ...this.nodes,
            [node.uuid]: node
        }     
        console.groupEnd();    
    }

    removeNode(uuid) {}

    traverse(f = null) {
        console.group('traversing graph', this.nodes);

        let out = [];
        let container = [this.root];
        let prev_node, next_node;
        let distance_from_root = 0;

        let limit = 10;

        while(limit && container.length) {             
            next_node = container.shift();
            distance_from_root = this.distanceBetween(next_node, this.root);

            if (f) f(next_node, container, distance_from_root);

            if(next_node) {
                console.log('distance from root', distance_from_root)
                console.log('traversing', next_node.name)
                console.log('remaining elements', container)

                if(next_node.parents)
                    // container = container.concat(next_node.parents); // depth
                    container = next_node.parents.concat(container); // breadth          

                console.log(next_node.parents)

                out.push(next_node.name);
            }
     
            limit--;
        }
            
        console.groupEnd();

        return out;
    }

    get root() {
        console.groupCollapsed('looking for root')
        
        let keys = Object.keys(this.nodes);        
        let node = this.nodes[keys[0]]; 

        console.log(node)

        while(node && node.children[0]){
            node = node.children[0];

            console.log('checking', node)         
        }

        // console.log('the root is',node.name);
        console.groupEnd();
        return node;
    }

    distanceBetween(a, b) {
        console.log(`checking distance between ${a.name} and ${b.name}`)
        let node = a;
        let count = 0;

        while (node !== b && node.children[0]) {
            node = node.children[0];
            count++;
        }

        return count;
    }
}

decorate(GraphStore, {
    uuid:       observable,
    nodes:      observable,
    root:       computed,
    traverse:   action,
    addNodeToEnd:    action,
    removeNode: action,
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