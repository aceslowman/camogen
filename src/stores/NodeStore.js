import {
    observable,
    action,
    computed,
} from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
    list,
    identifier,
    reference,
    custom,
    object,
} from "serializr"
import NodeDataStore from './NodeDataStore';

class NodeStore {
    @observable uuid  = uuidv1();
    @observable name  = "";
    @observable data  = null;
    @observable graph = null;

    @observable branch_index = null;    

    // filled with null so that mobx never
    // attempts to access unavailable [0]
    // (firstChild)
    @observable children = [null];
    @observable parents = [];
    
    @observable selected = false;

    constructor(graph, data, name) {      
        this.data  = data;
        this.name  = data ? data.name : name;
        this.graph = graph;

        if(data) this.setData(data);      
    }

    @action setData(obj) {
        this.data = obj;
        this.name = this.data.name;
        this.data.node = this;

        this.mapInputsToParents();
        
        if(this.graph) this.graph.update();

        return this;
    }
    
    @action mapInputsToParents() { 
        this.parents = this.data.inputs.map((e,i) => {
            if(this.parents.length && this.parents[i]) {
                return this.parents[i];
            } else {   
                let parent = new NodeStore(this.graph, null, e);
                return this.addParent(parent, i);
            }                    
        });
    }   

    @action connectParent(parent, index) {
        parent.firstChild = this;
        this.parents[index] = parent;     
    }

    @action connectChild(child, index) {
        child.parents[index] = this;
        this.firstChild = child;
    }

    @action addParent(node = new NodeStore(this.graph, null, 'input'), index = 0) {
        this.connectParent(node, index);
        if(this.graph) this.graph.addNode(node);
        return node;
    }

    @action addChild(node = new NodeStore(this.graph, null, 'ROOT NODE'), index = 0) {
        this.connectChild(node, index);
        this.graph.addNode(node);
        return node;
    }

    @action select(solo = false) {
        if(solo) this.graph.activeNode.selected = false;
        this.graph.activeNode = this;
        this.selected = true;
        return this;
    }

    @action edit() {
        if(this.graph.edit) this.graph.edit(this);
    }

    @action deselect() {
        this.graph.activeNode = null;
        this.selected = false;
        return this;
    }

    @computed get firstChild() {
        return this.children[0];
    }

    set firstChild(c) {
        this.children[0] = c;
    }

    @computed get firstParent() {
        return this.parents[0];
    }
    
    @computed get hasChildren() {
        return this.children.length > 0;
    }

    @computed get hasParents() {
        return this.parents.length > 0;
    }

    @computed get hasConnectedChildren() {        
        return this.children.some(e => e !== null)
    }

    @computed get hasConnectedParents() {
        return this.parents.some(e => e.data !== null)
    }
}

createModelSchema(NodeStore, {
    uuid:     identifier(),    
    name:     primitive(),
    selected: primitive(),
    parents:  list(reference(NodeStore)),
    children: list(reference(NodeStore)), // causes stack overflow?
    // data:     object(ShaderStore), 
    data:     object(NodeDataStore),
// });
}, c => {
    let p = c.parentContext.target;
    console.log('Node store factory', p)
    console.log('CHECK CONTEXT', c)
    console.log('node store graph', p.graph)
    let new_node = new NodeStore(p, c.json.data);
    console.log('resulting node', new_node)
    return new_node;
});

export default NodeStore;