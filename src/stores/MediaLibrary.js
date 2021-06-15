import {
  types,
  flow,
  getParent,
  getSnapshot,
  applySnapshot
} from "mobx-state-tree";

const Media = types
  .model("Media", {
    id: types.identifier,
    filename: types.string,
    filesize: types.integer    
  })
  .views(self => ({

  }))
  .actions(self => {
    
    return {
      
    };
  });

const MediaLibrary = types
  .model("MediaLibrary", {
    id: types.identifier,
    media: types.array(types.custom)
  })
  .views(self => ({

  }))
  .actions(self => {
    
    return {
      
    };
  });

export default MediaLibrary;
