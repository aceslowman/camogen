import {
  types,
  flow,
  getParent,
  getSnapshot,
  getRoot,
  applySnapshot
} from "mobx-state-tree";
import Shader from "../shaders/ShaderStore";
import { nanoid } from "nanoid";

/* 
  COLLECTION 
  
  TODO: 
    this has too much overlap with the Graph class
    think it's best to calculate the 'path' string in view()
*/

const Collection = types
  .model("Collection", {
    id: types.identifier,
    path: types.maybe(types.string),
    name: types.maybe(types.string),
    size: types.maybe(types.number),
    type: types.maybe(types.enumeration("Type", ["directory", "file"])),
    children: types.array(types.late(() => Collection)),
    extension: types.maybe(types.string),
    data: types.maybe(types.late(() => Shader))
  })
  .volatile(self => ({
    updateFlag: false
  }))
  .views(self => ({
    getByName: name => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          if (next_node.name === name) result.push(next_node);

          if (next_node.children) {
            container = container.concat(next_node.children); // depth first search
          }
        }
      }

      return result;
    },
    parent: () => {
      return getParent(self, 2);
    }
  }))
  .actions(self => {
    const traverse = (f = null, depthFirst = false) => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          result.push(next_node);

          /* 
            there are a lot of overlaps between the graph
            system and the collection system and they should 
            probably be collapsed into one

            for the time being, I'm using the path string
            (ie "/app/shaders/Math/Subtract") to get the distance
            between the current item and the root directory
          */

          // let path = next_node.path.split("/");
          // path.shift();
          // // ["app", "shaders", "Math", "Subtract"]
          // let distance_from_root = path.length - 2;

          if (f) f(next_node);

          if (next_node.children) {
            container = depthFirst
              ? container.concat(next_node.children) // depth first search
              : next_node.children.concat(container); // breadth first search
          }
        }
      }

      return result;
    };

    const addChild = (child, type = "file") => {
      if (!child) {
        // create short random string for new shader name
        let new_shader = Shader.create({ name: nanoid(5) });
        child = Collection.create({
          id: new_shader.name,
          name: new_shader.name,
          type: type,
          data: type === "file" ? new_shader : undefined,
          path: self.path + '/' + new_shader.name
        });
      }

      console.log("adding to collection", getSnapshot(self));

      self.children.push(child);
      getRoot(self).shader_collection.flagForUpdate();
      getRoot(self).setUpdateFlag() // check setUpdateFlag  
      getRoot(self).persistShaderCollection();

      return child;
    };

    const removeChild = child => {
      console.log("removing from collection", { self: self, child: child });
      self.children = self.children.filter(e => e !== child);

      getRoot(self).shader_collection.flagForUpdate();
      getRoot(self).setUpdateFlag()
      getRoot(self).persistShaderCollection();
    };

    const setData = datasnap => {
      self.name = datasnap.name;
      self.data = datasnap;
    };

    const setName = name => {
      if (getRoot(self).shader_collection.getByName(name).length > 0) {
        alert("there is already a node with the name of " + name)        
        return false
      } else {
        self.name = name;
        if (self.data.name) self.data.name = name;
        if (self.data) self.data.saveToLocalStorage()
        getRoot(self).shader_collection.flagForUpdate();
        getRoot(self).setUpdateFlag()
        return true
      }
    };

    const flagForUpdate = () => {
      self.updateFlag = !self.updateFlag;
    };

    return {
      traverse,
      addChild,
      removeChild,
      setData,
      setName,
      flagForUpdate
    };
  });

export default Collection;
