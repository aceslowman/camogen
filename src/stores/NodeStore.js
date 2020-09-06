import { Shader } from './ShaderStore';
import { types, getParent } from 'mobx-state-tree';
import { NodeData } from './NodeDataStore';
import { undoManager } from '../RootStore';

const Coordinate = types
    .model("Coordinate", {
        x: types.optional(types.number,0),
        y: types.optional(types.number,0)
    })
    
const GraphNode = types
    .model("GraphNode", {
        uuid: types.identifier,
        name: "empty node",        
        data: types.maybe(types.union(NodeData, types.late(() => Shader))),
        branch_index: types.maybe(types.number),        
        children: types.array(types.reference(types.late(()=>GraphNode))),
        parents: types.array(types.reference(types.late(()=>GraphNode))),
        selected: false,
        coordinates: types.optional(Coordinate, {x: 0, y: 0}),
    })
    .actions(self => {
        let parent_graph;

        function afterAttach() {
            parent_graph = getParent(self, 2);
        }

        function setParent(node, index = 0) {
            self.parents[index] = node;

            if (!node.children.includes(self.uuid)) {
                // node.setChild(self)                
            }  
            
            return node;
        }

        function setChild(node, index = 0) {       
            self.children[index] = node.uuid;

            if (!node.parents.includes(self.uuid)) {
                node.setParent(self)
            }
            
            return node;                 
        }

        function setBranchIndex(id) {
            self.branch_index = id;
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
            setBranchIndex,
            edit,
            select: () => undoManager.withoutUndo(select),
            deselect: () => undoManager.withoutUndo(deselect),            
        }
    })

export { GraphNode }