import { Shader } from './ShaderStore';
import { types, getParent } from 'mobx-state-tree';
import { NodeData } from './NodeDataStore';
import { undoManager } from '../RootStore';
import Coordinate from './utils/Coordinate';
import uuidv1 from 'uuid/v1';
    
const GraphNode = types
    .model("GraphNode", {
        uuid: types.identifier,
        name: "empty node",        
        // order when using Union matters!
        data: types.maybe(types.union(Shader, NodeData)),
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
            mapInputsToParents();
        }

        function setData(data) {
            self.data = data;
            self.name = data.name;

            // extract uniforms, map inputs/outputs
            self.data.extractUniforms();
            mapInputsToParents();
            
        }

        function mapInputsToParents() {
            if (!self.data) return;

            self.data.inputs.forEach((e,i) => {
                if (i >= self.parents.length) {
                    let parent = GraphNode.create({
                        uuid: uuidv1(),
                        name: e
                    });
                    
                    parent_graph.addNode(parent);
                    self.setParent(parent, i, true);
                }
            })

            if(!self.children.length) {
                let child = GraphNode.create({ uuid: uuidv1(), name: 'next' });
                parent_graph.addNode(child);
                return self.setChild(child).uuid;
            }
        }

        function setParent(node, index = 0, fix = false) {
            self.parents[index] = node.uuid;

            if (!node.children.includes(self)) {
                if(fix) node.setChild(self)                
            }  
            
            return node;
        }

        function setChild(node, index = 0, fix = false) {       
            self.children[index] = node.uuid;

            if (!node.parents.includes(self)) {
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
            setData,
            mapInputsToParents,
            setParent,
            setChild,
            setBranchIndex,
            edit,
            select: () => undoManager.withoutUndo(select),
            deselect: () => undoManager.withoutUndo(deselect),            
        }
    })

export { GraphNode }