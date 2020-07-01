import uuidv1 from 'uuid/v1';
import { observable } from 'mobx';
import { identifier, primitive, serializable, custom, getDefaultModelSchema } from 'serializr';
import NodeStore from './NodeStore';

export default class NodeDataStore {
    @serializable(identifier()) 
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable name = null;

    // @serializable(custom(
    //     (obj) => obj.uuid,
    //     (jsonValue, context, _oldValue, done) => {
    //         // this is basically what reference() does
    //         console.log(context)
    //         context.rootContext.await(
    //             getDefaultModelSchema(NodeStore),
    //             jsonValue,
    //             context.rootContext.createCallback(done),
    //         )
    //     },
    // ))
    @observable node = null;

    @observable inputs = [];
    @observable outputs = ["out"];

    @observable controls = [];

    constructor(node) {
        this.node = node;
    }
}