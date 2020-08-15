import { observable, action, computed } from 'mobx';
import NodeStore from './NodeStore';
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
export default class GraphStore {
    @serializable(identifier())
    @observable uuid = uuidv1();

    @serializable(map(object(NodeStore.schema)))
    @observable nodes = {};

    @observable parent = null;

    @observable selectedNode = null;

    @observable currentlyEditing = null;

    // for key binding focus
    @observable focused = false;

    // NOTE: toggle to force a re-render in React
    @observable updateFlag = false;

    constructor(parent) {
        this.parent = parent;
    
        // triggering too often!
        //set initial root node
        this.addNode().select();   
        // console.log('initializing '+this.uuid,this)        
    }    

    @action clear() {
        // re-initialize the nodes map
        this.nodes = {};
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
        
        this.nodes = {
            ...this.nodes,
            [node.uuid]: node
        }

        // NOTE: it's a red flag that this triggers so often
        // it might be causing issues with serialization
        // console.log(node.name+' node added!', this.nodes)
        return node;
    }

    /*
        removeNode(uuid)
    */
    @action removeNode(uuid) {        
        let node = this.nodes[uuid];

        // console.log('Removing node '+node.name, uuid)

        if (node.parents[0])
            node.parents[0].children[0] = node.children[0];
        if (node.children[0])
            node.children[0].parents[0] = node.parents[0];
         
        node.data.onRemove();
        delete this.nodes[uuid];

        if(this.nodesArray.length < 2) {
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
        // console.log('performing traversal on graph', this)
        let result = [];
        let container = [this.root];
        let next_node;
        let distance_from_root = 0;

        while(container.length) {             
            next_node = container.shift();
            
            if(next_node) {
                result.push(next_node.uuid);
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

    @action getNodeById(uuid) {
        let node = this.nodes[uuid];

        if(!node) console.error(`node was not found!`, uuid);
        return node;
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
}