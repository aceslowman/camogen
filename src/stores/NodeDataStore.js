import uuidv1 from 'uuid/v1';
import {
    observable
} from 'mobx';
import {
    identifier,
    primitive,
    serializable,
    list,
    // getDefaultModelSchema,
    // reference,
    // deserialize
} from 'serializr';
import { types } from 'mobx-state-tree';
// import NodeStore from './NodeStore';

export default class NodeDataStore {
    @serializable(identifier())
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable name = null;

    @serializable(list(primitive()))
    @observable inputs = [];

    @serializable(list(primitive()))
    @observable outputs = ["out"];

    @observable component_ref = null;

    // see workaround in constructor
    @observable node = null;

    @observable controls = [];

    constructor(node) {
        //workaround for circular dependency
        // getDefaultModelSchema(NodeDataStore).props["node"] = reference(NodeStore, (id,callback,context) => {
        //     console.log(id,context)
        //     console.log(node.graph)
        //     // return false;
        //     return context.args.node;
        // });
        // getDefaultModelSchema(NodeDataStore).props["node"] = reference(NodeStore);

        this.node = node;
    }
}

const NodeData = types
    .model("NodeData", {
        name: types.string,
        inputs: types.optional(types.array(types.string),[]),
        outputs: types.optional(types.array(types.string),["out"]),
        // component_ref: null,
        // node: null,
        // controls: [],
    })

export { NodeData }