import Shader from './ShaderStore';
import { types, getParent, getSnapshot } from 'mobx-state-tree';
// import { undoManager } from './RootStore';
import Coordinate from './utils/Coordinate';
import uuidv1 from 'uuid/v1';
import { allOps } from './operators';
    
const PossibleData = types.union(allOps, Shader);

// this doesn't seem to be where the invalidation is happening
// const nodeRef = types.reference(types.late(() => GraphNode, {
//     onInvalidated(ev) {console.log(ev)}
// }));
const nodeRef = types.safeReference(types.late(() => GraphNode));

const GraphNode = types
    .model("GraphNode", {
        uuid: types.identifier,
        name: "empty node",        
        data: types.maybe(PossibleData),      
        children: types.array(nodeRef),
        parents: types.array(nodeRef),
        selected: false,
        coordinates: types.optional(Coordinate, {x: 0, y: 0}),
    })
    .volatile(self => ({
        branch_index: 0,
        trunk_distance: 0,
    }))
    .actions(self => {
        let parent_graph;

        function afterAttach() {
            parent_graph = getParent(self, 2);
        }

        function setData(data) {
            self.data = data;
            self.name = data.name;
            
            // extract uniforms, map inputs/outputs
            parent_graph.update();
            parent_graph.afterUpdate();
            mapInputsToParents();            
        }

        function mapInputsToParents() {
            if (!self.data) return;

            // add new parent
            self.data.inputs.forEach((e,i) => {
                
                // add parent if necessary
                if (i >= self.parents.length) {
                    let parent = GraphNode.create({
                        uuid: uuidv1(),
                        name: e
                    });
                    
                    parent_graph.addNode(parent);
                    self.setParent(parent, i, true);
                } 
            })

            // add new node if no children are present
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

        function setName(n) {
            self.name = n;
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

        function beforeDestroy() {
            console.log(`about to delete graphnode ${self.name}`, getSnapshot(self))
        }

        return {
            beforeDestroy,
            afterAttach,
            setData,
            mapInputsToParents,
            setParent,
            setChild,
            setBranchIndex,
            setName,
            select,
            deselect
        }
    })

export default GraphNode;