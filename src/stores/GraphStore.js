import { observable, action, computed } from 'mobx';
import Node from './NodeStore';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    map,
    identifier,
    object,
} from "serializr"

// function findNodeById(uuid, callback) {
//     // let result = this.nodes.find((item) => item.uuid !== uuid);
//     let result = "";
//     callback(null, result);
// }

class GraphStore {
    @observable uuid   = uuidv1();
    @observable active = true;
    @observable parent = null;
    @observable activeNode = null;

    // for key binding focus
    @observable focused = false;

    // NOTE: toggle to force a re-render in React
    @observable updateFlag = false;

    @observable nodes = {};

    @observable keymap = {

    }

    onKeyDown(e) {
        // console.log(e.code)

        switch (e.code) {
            case "ArrowLeft":
                if (this.activeNode.firstChild) {
                    let index_in_child = this.activeNode.firstChild.parents.indexOf(this.activeNode);
                    if (this.activeNode.firstChild.parents[index_in_child - 1])
                        this.activeNode = this.activeNode.firstChild.parents[index_in_child - 1].select(true);
                }
                break;
            case "ArrowRight":
                if (this.activeNode.firstChild) {
                    let index_in_child = this.activeNode.firstChild.parents.indexOf(this.activeNode);
                    if (this.activeNode.firstChild.parents[index_in_child+1])
                        this.activeNode = this.activeNode.firstChild.parents[index_in_child + 1].select(true);
                }
                break;
            case "ArrowUp":
                if (this.activeNode.firstParent)
                    this.activeNode = this.activeNode.firstParent.select(true);
                break;
            case "ArrowDown":
                if (this.activeNode.firstChild)
                    this.activeNode = this.activeNode.firstChild.select(true);
                break;      
            case "Tab":
                // open up the node data component
                break;  
            default:
                break;
        }
    }

    constructor(parent, node = new Node(this, null, 'NEW NODE')) {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.parent = parent;
        this.addNode(node).select();   
    }    

    @action clear() {
        this.nodes = {};
        this.addNode().select();
        this.update(); 
    }

    @action update() {
        let update_queue = this.calculateBranches();        
        this.afterUpdate(update_queue);
        
        // add new node at end if necessary
        if(this.root.data) {
            this.root.addChild();            
        }            
        
        this.updateFlag = !this.updateFlag;
    }

    @action addNode(node = new Node(this, null, 'NEW NODE')) {
        node.graph = this;
        
        this.nodes = {
            ...this.nodes,
            [node.uuid]: node
        }

        return node;
    }

    @action removeNode(uuid) {
        let node = this.nodes[uuid];

        if (node.parents[0])
            node.parents[0].children[0] = node.children[0];
        if (node.children[0])
            node.children[0].parents[0] = node.parents[0];

        console.log('next child', node.children[0])
                
        node.data.onRemove();
        delete this.nodes[uuid];

        this.update();
    }

    @action traverse(f = null, depthFirst = false) {
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

    @action afterUpdate = (t) => {        
    }

    @action getNodeById(uuid) {
        let node = this.nodes[uuid];

        if(!node) console.error(`node was not found!`, uuid);
        return node;
    }

    @action toggleFocus() {
        this.focused = !this.focused;

        if (this.focused) {
            console.log('registering event listener');
            document.addEventListener('keydown', this.onKeyDown, true);
        } else {
            console.log('removing event listener');
            document.removeEventListener('keydown', this.onKeyDown, true);
        }
    }

    @computed get root() {
        let keys = Object.keys(this.nodes);        
        let node = this.nodes[keys[0]]; 

        while(node && node.children[0]){
            node = node.children[0];       
        }

        return node;
    }

    @computed get nodeCount() {
        return Object.keys(this.nodes).length;
    }

    @computed get nodesArray() {
        return Object.keys(this.nodes).map((uuid)=>this.getNodeById(uuid))
    }

    // @computed set focused(e) {
    //     this.focused = e;
        
    //     return this.focused;
    // }
}

createModelSchema(GraphStore, {
    uuid:    identifier(),
    nodes:   map(object(Node)),   
}, c => {
    let p = c.parentContext.target;
    console.log('Graph store factory', p)
    return new GraphStore(p);
});

export default GraphStore;