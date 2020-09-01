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
} from "serializr";

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
        return new NodeStore(
            null,
            parent_graph, 
            c.json.data, 
        );        
    },    
    props: getDefaultModelSchema(NodeStore).props
}