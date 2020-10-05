// TODO: ideally this lives in it's own file, but there are circular dependency issues
import { types, getParent, getSnapshot, getRoot } from "mobx-state-tree";
import { getOperator } from './operators';
import Parameter from './ParameterStore';

// TODO: ideally this lives in it's own file, but there are circular dependency issues
// that are unresolved with mobx-state-tree late
const operatorGraph = types
    .model("OperatorGraph", {
        param: types.reference(Parameter)
    })
    .actions(self => {

        function afterAttach() {
            self.addNode();
            self.update();
        }

        function setSelectedByName(name) {
            if (!self.selectedNode) self.selectedNode = self.root;
            let op = getOperator(name);
            if (op) {
                self.selectedNode.setData(op);
                self.update();
            } else {
                console.error('operator was not found!');
            }
        }

        /*
            afterUpdate(queue)
        */
        function afterUpdate() {
            // this allows the parameter to remain unchanged 
            // when the graph is empty. 
            if (self.nodes.size <= 1) return;

            // traverses tree from root
            let result = self.root.parents[0].data.update();

            self.param.setValue(result);
        }

        function beforeDestroy() {
            console.log('about to delete operator graph')
        }

        return {
            beforeDestroy,
            afterAttach,
            afterUpdate,
            getOperator,
            setSelectedByName,
        }
    })

export default operatorGraph;