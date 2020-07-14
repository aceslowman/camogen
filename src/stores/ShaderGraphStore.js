import {
    deserialize, getDefaultModelSchema
} from "serializr";
import { action, computed } from 'mobx';
import GraphStore from './GraphStore';
import ShaderStore from './ShaderStore';

export default class ShaderGraphStore extends GraphStore {
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
    
    /*
        getShader(name = null)

        retrieves shader with matching name
        this method searches MainStore.shader_list
        for matches, including in subdirectories.
    */
    @action getShader(name = null) {
        // const exists = Object.keys(this.mainStore.shader_list).includes(name);
        let result = null;

        for (let key in this.mainStore.shader_list) {
            let item = this.mainStore.shader_list[key];
            // console.log(item)
            if(item._isDirectory) {
                // console.log('return directory',item)

                for(let subkey of Object.keys(item)) {
                    // console.log(subkey)
                    if(subkey==='_isDirectory') continue;
                    let subItem = item[subkey]
                    // console.log(subItem.name, name)
                    if (subItem.name === name) {
                        result = subItem.name === name ? subItem : null;
                        break;
                    }                    
                }

            } else {
                if(key === name){
                    result = item;
                    break;
                }
            }
        }

        if (result) {           
            return deserialize(ShaderStore.schema, result);
        } else {
            console.error(`couldn't find shader named '${name}'`);
            return null;
        }
    }

    @computed get mainStore() {
        return this.parent.parent;
    }

    @computed get ready() {
        /*
            this is a hacky solution that helps check
            to see if there are any nodes that are 
            ready for output. if there is only a 
            root node, then the Runner will just output
            the default background color.
        */
        return this.nodesArray.length > 1;
    }

    @action edit(node) {
        this.currentlyEditing = node.data;
    }
}

ShaderGraphStore.schema = {
    factory: c => {
        let parent = c.parentContext ? c.parentContext.target : null;
        console.log(parent)
        return new ShaderGraphStore(parent);
    },
    extends: getDefaultModelSchema(GraphStore), 
    props: getDefaultModelSchema(ShaderGraphStore).props
}