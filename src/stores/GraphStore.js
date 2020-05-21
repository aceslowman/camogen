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
        console.groupCollapsed('traversing graph', this.nodes);

        let out = [];
        let container = [this.root];

        let limit = 10;
        while(limit && container.length) {            
            let next_node = container.shift();
            if(next_node === null) continue;

            console.log('traversing', next_node.name)
            console.log('remaining elements', container)
            
            if(f) f(next_node,container);            

            if(next_node.parents)
                container = container.concat(next_node.parents);

            console.log(next_node.parents)

            out.push(next_node.name);

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