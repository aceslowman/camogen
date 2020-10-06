import { getParent, getRoot, types } from "mobx-state-tree";
import { OperatorGraph } from './GraphStore';

const Parameter = types
    .model("Parameter", {
        uuid: types.identifier,
        name: types.maybe(types.string),
        value: types.optional(types.union(types.number, types.string, types.boolean),0),
        graph: types.maybe(types.reference(types.late(()=>OperatorGraph))),
        controlType: types.maybe(types.string)
    })
    .actions(self => {
        function createGraph() {
            let parent_shader = getParent(self, 4);
            let parent_scene = getRoot(self).scene;

            let opgraph = parent_scene.addOperatorGraph(self);

            parent_shader.addToUpdateGroup(opgraph);

            self.graph = opgraph;        

            self.graph.root.select(); 
        }

        function setValue(v) {
            self.value = v;
        }

        return {
            createGraph,
            setValue
        }
    })

export default Parameter;