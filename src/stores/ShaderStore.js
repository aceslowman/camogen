import { NodeData } from './NodeDataStore';
import { types } from "mobx-state-tree";
import * as DefaultShader from './shaders/DefaultShader';
import { Target } from "./TargetStore";

let shader = types
    .model("Shader", {
        // uniforms: [],
        precision: types.optional(types.string, DefaultShader.precision),
        vert: types.optional(types.string, DefaultShader.vert),
        frag: types.optional(types.string, DefaultShader.frag),
        // ref: null,
        target: types.maybe(Target),
        ready: false,
    })
    .actions(self => {
        // let node = self.parent.value;

        function afterCreate() {
            // console.log('self',self)
            // console.log('node', node)
        }

        return {
            afterCreate
        }
    })

// extends Graph!
const Shader = types.compose(NodeData, shader);

export { Shader }