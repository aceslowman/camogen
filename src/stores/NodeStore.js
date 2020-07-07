import {
    observable,
    action,
    computed,
} from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    createModelSchema,
    getDefaultModelSchema,
    primitive,
    list,
    identifier,
    reference,
    custom,
    serializable,
    serialize,
    deserialize
} from "serializr"
import ShaderStore from './ShaderStore';
import ParameterStore from './ParameterStore';

export default class NodeStore {
    @serializable(identifier())
    @observable uuid  = uuidv1();

    @serializable(primitive())
    @observable name  = "";

    // check note in constructor
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
        /*
            NOTE: the below code is meant to provide polymorphism to the
            NodeDataStore, serializing it as either a ParameterStore
            or a ShaderStore. 

            this does honestly still feel clunky, so it's worth keeping
            an eye out for a new solution
        */
        getDefaultModelSchema(NodeStore).props["data"] = custom(
            (v) => {
                if(v) {
                    switch (v.constructor.name) {
                        case "ParameterStore": 
                            console.log("serializing ParameterStore")
                            return serialize(ParameterStore, v);
                        case "ShaderStore":
                            console.log("serializing ShaderStore")
                            return serialize(ShaderStore, v);
                        default:
                            return null;
                    }
                } else {
                    return null;
                }
            },
            (v, c) => {
                if (v) {
                    switch (c.parentContext.target.constructor.name) {
                        case "ParameterGraphStore":
                            return deserialize(
                                ParameterStore.schema, 
                                v, 
                                v=>console.log('onready callback', v), 
                                {
                                    node: this,
                                    graph: c.target.graph
                                }
                            );
                        case "ShaderGraphStore":
                            return deserialize(
                                ShaderStore.schema, 
                                v, 
                                (err)=>{
                                    if(err)
                                        console.error(err)
                                }, 
                                {
                                    node: this,
                                    graph: c.target.graph
                                }
                            );
                        default:
                            return null;
                    }
                } else {
                    return null;
                }
            }
        )

        getDefaultModelSchema(NodeStore).props["children"] = list(reference(NodeStore.schema));
        getDefaultModelSchema(NodeStore).props["parents"] = list(reference(NodeStore.schema));

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

        // if there are no children, make one
        if (!this.firstChild) {
            this.addChild();            
        } 
        
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

NodeStore.schema = {
    factory: c => {
        let parent_graph = c.parentContext.target;
        return new NodeStore(parent_graph, c.json.data, null, c.json.uuid);        
    },    
    props: getDefaultModelSchema(NodeStore).props
}