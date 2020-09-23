import { types, flow } from "mobx-state-tree";
import Shader from "../ShaderStore";

const fs = window.require('fs');

const Collection = types
  .model("Collection", {
    path: types.maybe(types.string),
    name: types.maybe(types.string),
    size: types.maybe(types.number),
    type: types.maybe(types.enumeration("Type",["directory","file"])),
    children: types.maybe(types.array(types.late(()=>Collection))),
    extension: types.maybe(types.string),
    data: types.maybe(Shader),
  })
  .views(self => ({
    getByName: (name) => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          if(next_node.name === name) result.push(next_node);          

          if (next_node.children) {
            container = container.concat(next_node.children) // depth first search              
          }
        }
      }
      if(result.length > 1) console.log('multiple results found for '+name, result)

      return result[0];
    },
  }))
  .actions(self => {
    const preloadAll = flow(function* preloadAll() {
      if(self.children) {
        yield Promise.all(self.children.map(flow(function*(e,i){
          yield e.preloadAll();
        })))
      } else if(self.type === "file"){                
        let result = yield fs.promises.readFile(self.path); 
        self.data = JSON.parse(result, (key, value) => {
          // if(key === )
          return value;
        });
      }
    });

    const traverse = (f = null, depthFirst = false) => {
      let result = [];
      let container = [self];
      let next_node;

      while (container.length) {
        next_node = container.shift();

        if (next_node) {
          result.push(next_node);

          if (f) f(next_node);

          if (next_node.children) {
            container = depthFirst ?
              container.concat(next_node.children) // depth first search
              :
              next_node.children.concat(container) // breadth first search
          }
        }
      }

      return result;
    }

    return {
      preloadAll,
      traverse
    }
  })

  export default Collection;