import {
    deserialize, getDefaultModelSchema
} from "serializr";
import { action, computed } from 'mobx';
import GraphStore from './GraphStore';
import ShaderStore from './ShaderStore';

export default class ShaderGraphStore extends GraphStore {

    /*
        afterUpdate(queue)

        after graph updates, the shader graph updates targets
        and syncs the shaders with the targets

        accepts an array of nodes, ordered using either depth or
        breadth first search
    */
    @action afterUpdate(queue) {
        queue.forEach(node => {
            if (node.data) {
                if (this.parent.targets.length && this.parent.targets[node.branch_index]) {
                    node.data.target = this.parent.targets[node.branch_index];
                } else {
                    node.data.target = this.parent.addTarget();
                }

                node.data.target.assignShader(node.data);  

                /*
                    if this is the first time a node 
                    has been updated, initialize,
                    otherwise, synchronize.
                */ 
                if(node.data.ready) {
                    node.data.sync();
                } else {
                    node.data.init();
                }                                             
            }
        });
    }

    /*
        addNodeByName(name = null)

        adds a new node to the graph with data
        that matches the 'name' argument. since
        this will look for all shaders with that
        name, it's worth keeping all shader names 
        unique.
    */
    @action addNodeByName(name = null) {
        let data = this.getShader(name);

        // by default, add to empty root node
        this.root.setData(data);
        // this.root.select(true);
        this.update();

        return this.root;
    }

    /*
        setSelectedByName(name)

        for the current selectedNode, retrieve
        shader with the corresponding name and
        set it as the nodeData        
    */
    @action setSelectedByName(name) {
        let data = this.getShader(name);

        if(this.selectedNode.data) {
            let target = this.selectedNode.data.target;
            target.removeShader(this.selectedNode.data);
        }        

        this.selectedNode.setData(data);

        return this.selectedNode;
    }
    
    /*
        getShader(name = null)

        retrieves shader with matching name
        this method searches MainStore.shader_list
        for matches, including in subdirectories.
    */
    @action getShader(name = null) {
        let result = null;

        // first, check built-in inputs
        for (let key in this.mainStore.input_list) {            
            let item = this.mainStore.input_list[key];

            if (key === name) {
                result = item;
                break;
            }
        }

        if(result) return new result;

        // and check custom-shaders. matches will override built-in inputs
        for (let key in this.mainStore.shader_list) {
            let item = this.mainStore.shader_list[key];

            if(item._isDirectory) {
                for(let subkey of Object.keys(item)) {
                    if(subkey==='_isDirectory') continue;
                    let subItem = item[subkey]
                    
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

    @action edit(node) {
        this.currentlyEditing = node.data;
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