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

    @observable children = [null];
    @observable parents = [];
    
    @observable selected = false;

    constructor(
        name, 
        graph, 
        data = null
    ) { 
        /*
            NOTE: the below code is meant to provide polymorphism to the
            NodeDataStore, serializing it as either a ParameterStore
            or a ShaderStore. 

            this does honestly still feel clunky, so it's worth keeping
            an eye out for a new solution
        */
        getDefaultModelSchema(NodeStore).props["data"] = custom(
            (v) => {
                if (v) {
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
            // deserialize
            (v, c) => {
                if (v) {
                    let node_data; 

                    switch (c.parentContext.target.constructor.name) {
                        case "ParameterGraphStore":
                            node_data = deserialize(
                                ParameterStore.schema, 
                                v, 
                                (err)=>{
                                    if(err) console.error(err)
                                }, 
                                {
                                    node: this,
                                    graph: c.target.graph
                                }
                            );
                            // console.log(node_data)
                            this.setData(node_data);
                            // node_data.init()
                            node_data.generateControls();
                            return node_data;
                        case "ShaderGraphStore":
                            node_data = deserialize(
                                ShaderStore.schema, 
                                v, 
                                (err)=>{
                                    if(err) console.error(err)
                                }, 
                                {
                                    node: this,
                                    graph: c.target.graph
                                }
                            );
                            console.log(`deserializing ${node_data.name}`,node_data)
                            this.setData(node_data);
                            // node_data.init()
                            node_data.generateControls();
                            return node_data;
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

    @action setData(nodeData) {
        this.data = nodeData;

        /*
            this masks an issue where the failure
            to load a shader causes a crash
        */
        console.log(this.data)
        this.name = this.data.name;
        this.data.node = this;

        this.mapInputsToParents();

        // if there are no children, make one
        if (!this.firstChild) {
            this.addChild();
        }

        if (this.graph) this.graph.update();
        
        return this;
    }
    
    /*
        mapInputsToParents()

        this method will go through the nodeData 
        and create connections to other nodes based
        on the inputs and outputs that are defined.

        this helps when a shader has multiple shader
        inputs for example
    */
    @action mapInputsToParents() { 
        if(!this.data) {
            console.error(`(${this.name}) is missing data!`,this); 
            return;
        }
        
        this.parents = this.data.inputs.map((e,i) => {
            if(this.parents.length && this.parents[i]) {
                return this.parents[i];
            } else {   
                let parent = new NodeStore(e, this.graph);
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

    @action addParent(node = new NodeStore('input',this.graph), index = 0) {
        this.connectParent(node, index);
        this.graph.addNode(node);
        return node;
    }

    @action addChild(node = new NodeStore('ROOT NODE',this.graph), index = 0) {
        this.connectChild(node, index);
        this.graph.addNode(node);
        return node;
    }

    @action select(solo = false) {
        if(solo) this.graph.selectedNode.selected = false;
        this.graph.selectedNode = this;
        this.selected = true;
        return this;
    }

    @action deselect() {
        this.graph.selectedNode = null;
        this.selected = false;
        return this;
    }

    @action edit() {
        this.graph.edit(this);
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
        return this.parents.some(e => e ? e.data !== null : false)
    }
}

NodeStore.schema = {
    factory: c => {
        let parent_graph = c.parentContext.target;
        return new NodeStore(
            null,
            parent_graph, 
            c.json.data, 
        );        
    },    
    props: getDefaultModelSchema(NodeStore).props
}