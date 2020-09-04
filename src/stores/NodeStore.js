import {
    observable,
    action,
    computed,
} from 'mobx';
import uuidv1 from 'uuid/v1';
import {
    getDefaultModelSchema,
    primitive,
    identifier,
    serializable,
    custom,
    serialize,
    deserialize,
    reference,
    list
} from "serializr";

import ParameterStore from './ParameterStore';
import ShaderStore, { Shader } from './ShaderStore';
import { types, getParent } from 'mobx-state-tree';
import NodeDataStore, { NodeData } from './NodeDataStore';
// import GraphStore from './GraphStore';

export default class NodeStore {
    @serializable(identifier())
    @observable uuid  = uuidv1();

    @serializable(primitive())
    @observable name  = "";

    @observable data  = null;

    @observable graph = null;

    @observable branch_index = null;    

    @observable children = [null];

    @observable parents = [];
    
    @observable selected = false;

    @observable node = null;

    @observable controls = [];

    @observable coordinates = { x: 0, y: 0 };

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
                            console.log("sezrializing ParameterStore")
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

                    // if(c.target.graph === c.target)

                    switch (c.parentContext.target.constructor.name) {
                        case "ParameterGraphStore":
                            node_data = deserialize(
                                ParameterStore.schema,
                                v,
                                (err) => {
                                    if (err) console.error(err)
                                }, {
                                    node: this,
                                    graph: c.target.graph
                                }
                            );
                            // console.log(node_data)
                            c.target.setData(node_data);
                            // node_data.init()
                            // node_data.generateControls();
                            return node_data;
                        case "ShaderGraphStore":
                            console.log(c)
                            node_data = deserialize(
                                ShaderStore.schema,
                                v,
                                (err) => {
                                    if (err) console.error(err)
                                }, {
                                    node: c.target,
                                    graph: c.target.graph
                                }
                            );
                            console.log(`deserializing ${node_data.name}`, node_data)
                            c.target.setData(node_data);
                            // c.target.data.graph =
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
    }

    @action setData(nodeData) {
        this.data = nodeData;

        /*
            this masks an issue where the failure
            to load a shader causes a crash
        */
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

    @action addParent(node = new NodeStore('input',this.graph), index = 0) {
        node.firstChild = this;
        this.parents[index] = node;
        this.graph.addNode(node);
        return node;
    }

    @action addChild(node = new NodeStore('ROOT',this.graph), index = 0) {
        node.parents[index] = this;
        this.firstChild = node;
        this.graph.addNode(node);
        return node;
    }

    @action select() {
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
        console.log('parent_graph', parent_graph)
        console.log('c.json.data', c.json)
        return new NodeStore(
            null,
            parent_graph, 
            c.json.data, 
        );        
    },    
    props: getDefaultModelSchema(NodeStore).props
}

const Coordinate = types
    .model("Coordinate", {
        x: types.optional(types.number,0),
        y: types.optional(types.number,0)
    })
    
const GraphNode = types
    .model("GraphNode", {
        uuid: types.identifier,
        name: "empty node",
        // allows for polymorphism
        data: types.maybe(types.union(NodeData, types.late(() => Shader))),
        // graph: null,
        branch_index: types.maybe(types.number),
        // late is used here to avoid circular dependency issue
        children: types.array(types.reference(types.late(()=>GraphNode))),
        parents: types.array(types.reference(types.late(()=>GraphNode))),
        selected: false,
        // node: null,
        // controls: [],
        coordinates: types.optional(Coordinate, {x: 0, y: 0}),
    })
    .actions(self => {
        let parent_graph;

        function afterAttach() {
            parent_graph = getParent(self, 2);
        }

        function setParent(node, index = 0) {
            self.parents[index] = node;
            // if (!node.children.includes(node.uuid)) {
                // node.setChild(self)                
            // }  
            // parent_graph.addNode(node);
            return node;
        }

        function setParents(nodes) {
            
        }

        function setChild(node, index = 0) {       
            self.children[index] = node.uuid;

            if (!node.parents.includes(self.uuid)) {
                node.setParent(self)
            }
            
            return node;                 
        }

        function edit() {
            parent_graph.setEditing(self)
            self.editing = true;
            return self;
        }

        function select() {
            parent_graph.setSelected(self)
            self.selected = true;
            return self;
        }

        function deselect() {
            parent_graph.setSelected(null)
            self.selected = false;
            return self;
        }

        return {
            afterAttach,
            setParent,
            setChild,
            edit,
            select,
            deselect
        }
    })

export { GraphNode }