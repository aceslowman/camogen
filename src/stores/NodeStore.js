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
    deserialize,
    custom,
} from "serializr"

class Connection {
    uuid = uuidv1();

    constructor(
        name = '',
        node = null,
        to   = null       
    ) {
        this.name = name;
        this.node = node;
        this.to   = to;                
    }

    connectTo(destination = null) {
        this.to = destination;
        destination.to = this;
    }

    disconnect() {
        this.to.destination = null;
        this.to = null;
    }
}

decorate(Connection, {
    uuid:       observable,    
    to:         observable,
    connectTo:  action,
    disconnect: action,
});

class NodeStore {
    uuid = uuidv1();
    name = "";
    data = null;
    parents  = [];
    children = [];

    constructor(data) {
        this.data = data;
        this.name = data.name;

        this.parents = this.data.inputs.map(e=>(
            // new Connection(e, this, null, null)
            // e
            null
        ));

        this.children = [
            // new Connection('out', this, null, null)
            null
        ];

        this.data.node = this;
    }

    connectParent(parent, index) {
        parent.children[index] = this;
        this.parents[index] = parent;
    }

    connectChild(child, index) {
        child.parents[index] = this;
        this.children[index] = child;
    }

    get hasChildren() {
        return this.children.length > 0;
    }

    get hasParents() {
        return this.parents.length > 0;
    }

    get hasConnectedChildren() {        
        return this.children.every(e => e !== null)
    }

    get hasConnectedParents() {
        return this.parents.every(e => e !== null)
    }
}

decorate(NodeStore, {
    name:        observable,
    data:        observable,
    position:    observable,
    parents:     observable,
    children:    observable,
    connectChild:     action,
    connectParent:    action,
    hasConnectedChildren: computed,
    hasConnectedParents:  computed,
});

createModelSchema(NodeStore, {
    uuid:     identifier(),    
    name:     primitive(),
    data:     list(custom(
        (v) => {

        },
        (v, context) => {

        },
    )), // Shader or Operator
    position: primitive(),
    parents:   list(object(Connection)),
    children:  list(object(Connection)),
}, c => {
    let p = c.parentContext.target;
    console.log('Node store factory', p)
    return new NodeStore(p);
});

export default NodeStore;