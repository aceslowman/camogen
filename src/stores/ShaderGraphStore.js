import {
    createModelSchema, deserialize
} from "serializr";
import { action, computed, observable } from 'mobx';
import GraphStore from './GraphStore';
import ShaderStore from './ShaderStore';

export default class ShaderGraphStore extends GraphStore {
    @observable activeTarget = null;
    @observable currentlyEditing = null;

    // assignTargets
    @action afterUpdate(queue) {
        queue.forEach(node => {
            if (node.data) {
                if (this.parent.targets.length && this.parent.targets[node.branch_index]) {
                    node.data.target = this.parent.targets[node.branch_index];
                } else {
                    node.data.target = this.parent.addTarget();
                }

                node.data.target.assignShader(node.data);

                node.data.init();
            }
        });
    }

    @action addNodeByName(name = null) {
        let data = this.getShader(name);

        // by default, add to empty root node
        this.root.setData(data);
        this.root.select(true);
        this.update();
    }

    @action setSelectedByName(name) {
        // TODO need to delete shader if the node
        // was occupied
        let data = this.getShader(name);
        this.activeNode.setData(data);
    }
    
    @action getShader(name = null) {
        if (name === null) {
            console.log(this.mainStore.shader_list)
        } else if (Object.keys(this.mainStore.shader_list).includes(name)) {
            return deserialize(ShaderStore, this.mainStore.shader_list[name])
        } else {
            console.error(`couldn't find shader named '${name}'`);
            return null;
        }
    }

    @computed get mainStore() {
        return this.parent.parent;
    }

    @action edit(node) {
        this.currentlyEditing = node.data;
    }
}

createModelSchema(ShaderGraphStore, {
    extends: GraphStore
});