import {
    getDefaultModelSchema
} from "serializr"
import GraphStore from './GraphStore';
import { action, computed } from 'mobx';

export default class ParameterGraphStore extends GraphStore { 
    @action afterUpdate() {
        this.recalculate();
    }

    @action recalculate() {
        let v = 0;

        let queue = this.calculateBranches();
        queue.forEach(node => {
            // if not root node
            if (node.data) v = node.data.update(v);

            this.parent.value = v;
        });
    }

    @action setSelectedByName(name) {
        // TODO need to delete operator if the node
        // was occupied
        let data = this.getOperator(name);
        this.selectedNode.setData(data).select(true);
        this.update();
    }

    @action getOperator(name = null) {
        if (name === null) {
            console.log(this.mainStore.operator_list)
        } else if (Object.keys(this.mainStore.operator_list).includes(name)) {
            return new this.mainStore.operator_list[name](this);            
        } else {
            console.error(`couldn't find operator named '${name}'`);
            return null;
        }
    }

    @computed get mainStore() {
        console.log(this)
        return this.parent.parent.parent.node.graph.parent.parent;
    }

    @action edit() {
        
    }
}

ParameterGraphStore.schema = {
    factory: c => {
        let parent = c.parentContext ? c.parentContext.target : null;
        return new ParameterGraphStore(parent);
    },
    extends: getDefaultModelSchema(GraphStore),
    props: getDefaultModelSchema(ParameterGraphStore).props
}