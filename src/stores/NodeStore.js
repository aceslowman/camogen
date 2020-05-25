import {
    observable,
    action,
    decorate,
    computed,
} from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    primitive,
    list,
    object,
    identifier,
    // deserialize,
    custom,
} from "serializr"

class NodeStore {
    uuid  = uuidv1();
    name  = "";
    data  = null;
    graph = null;

    branch_index = null;

    parents  = [];
    children = [null];
    
    selected = false;

    constructor(graph, data, name) {      
        this.data  = data;
        this.name  = data ? data.name : name;
        this.graph = graph;

        if(data) this.setData(data);      
    }

    setData(obj) {
        this.data = obj;
        this.name = this.data.name;
        this.data.node = this;

        this.mapInputsToParents();
        this.mapOutputsToChildren();

        this.graph.update();

        console.log('DATA',this)
    }
    
    mapInputsToParents() {     
        this.parents = this.data.inputs.map((e,i) => {
            if(this.parents[i]) {
                return this.parents[i];
            } else {   
                let parent = new NodeStore(this.graph, null, e);
                return this.addParent(parent, i);
            }                    
        });
    }

    mapOutputsToChildren() {
        // this destroys the connection to the existing child, 
        // ignore this for now. this is functionally
        // multiinput, but single-output
        // this.children = this.data.outputs.map(()=>null);
    }    

    connectParent(parent, index) {
        parent.firstChild = this;
        this.parents[index] = parent;     
    }

    connectChild(child, index) {
        child.parents[index] = this;
        this.firstChild = child;
    }

    addParent(node = new NodeStore(this.graph, null, 'input'), index = 0) {
        this.connectParent(node, index);
        this.graph.addNode(node);
        return node;
    }

    addChild(node = new NodeStore(this.graph, null, 'ROOT NODE'), index = 0) {
        this.connectChild(node, index);
        this.graph.addNode(node);
        return node;
    }

    select(solo = false) {
        if(solo) this.graph.activeNode.selected = false;
        this.graph.activeNode = this;
        this.selected = true;
        return this;
    }

    deselect() {
        this.graph.activeNode = null;
        this.selected = false;
        return this;
    }

    get firstChild() {
        return this.children[0];
    }

    set firstChild(c) {
        this.children[0] = c;
    }

    get firstParent() {
        return this.parents[0];
    }
    
    get hasChildren() {
        return this.children.length > 0;
    }

    get hasParents() {
        return this.parents.length > 0;
    }

    get hasConnectedChildren() {        
        return this.children.some(e => e !== null)
    }

    get hasConnectedParents() {
        return this.parents.some(e => e.data !== null)
    }
}

decorate(NodeStore, {
    uuid:                 observable,
    name:                 observable,
    selected:             observable,
    data:                 observable,
    position:             observable,
    parents:              observable,
    children:             observable,
    graph:                observable,
    branch_index:         observable,
    addChild:             action,
    connectChild:         action,
    connectParent:        action,
    select:               action,
    deselect:             action,
    setData:              action,
    hasConnectedChildren: computed,
    hasConnectedParents:  computed,
});

createModelSchema(NodeStore, {
    uuid:     identifier(),    
    name:     primitive(),
    selected: primitive(),  
    data:     list(custom(
        (v) => {},
        (v, context) => {},
    )), // Shader or Operator
}, c => {
    let p = c.parentContext.target;
    console.log('Node store factory', p)
    return new NodeStore(p);
});

export default NodeStore;