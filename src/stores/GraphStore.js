import { observable, action, computed } from 'mobx';
import NodeStore from './NodeStore';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    map,
    getDefaultModelSchema,
    identifier,
    object,
    custom,
    serializable,
    serialize
} from "serializr"

export default class GraphStore {
    @serializable(identifier())
    @observable uuid = uuidv1();

    // @serializable(map(object(NodeStore.schema)))
    // https://github.com/mobxjs/serializr/issues/129
    @serializable(map(custom(
        (v) => {
            // if(s.data) s.data.node = s.uuid; 
            console.log(v)

            return serialize(NodeStore.schema, v)

            // return {
            //     ...s,
            //     data: {
            //         ...s.data,
            //         node: s.uuid,
            //         graph: s.graph.uuid,
            //     },
            //     // graph: {
            //     //     ...s.graph,
            //     //     activeNode: s.graph.activeNode.uuid
            //     // }
            // };
        },
        (jsonValue, context, _oldValue, done) => {
            console.log(jsonValue)
            // this is basically what reference() does
            context.rootContext.await(
                getDefaultModelSchema(NodeStore),
                jsonValue,
                context.rootContext.createCallback(done),
            )
        },
    )))
    @observable nodes = {};

    // @serializable(object(SceneStore))
    @observable parent = null;

    // @serializable(object(NodeStore))
    @observable activeNode = null;

    // @serializable(object(NodeStore))
    @observable currentlyEditing = null;

    // for key binding focus
    @observable focused = false;

    // NOTE: toggle to force a re-render in React
    @observable updateFlag = false;

    @observable keymap = {};

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

    constructor(parent) {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.parent = parent;

        //set initial root node
        this.addNode().select();   
    }    

    @action clear() {
        this.nodes = {};
        this.currentlyEditing = null;
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

    @action addNode(node = new NodeStore(this, null, 'NEW NODE')) {
        node.graph = this;
        
        this.nodes = {
            ...this.nodes,
            [node.uuid]: node
        }

        // NOTE: it's a red flag that this triggers so often
        // console.log('node added!', this.nodes)
        return node;
    }

    @action removeNode(uuid) {
        let node = this.nodes[uuid];

        if (node.parents[0])
            node.parents[0].children[0] = node.children[0];
        if (node.children[0])
            node.children[0].parents[0] = node.parents[0];
         
        node.data.onRemove();
        delete this.nodes[uuid];

        // console.log(uuid, this.nodes)

        if(this.nodesArray.length < 2) {
            this.clear();
        } else {
            this.update();
        }   
    }

    @action traverse(f = null, depthFirst = false) {
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
}