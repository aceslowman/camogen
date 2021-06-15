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
  .volatile(self => ({
    content: null
  }))
  .actions(self => {
    return {};
  });

const MediaLibrary = types
  .model("MediaLibrary", {
    id: types.identifier,
    media: types.array(Media)
  })
  .views(self => ({
    getInfo: () => {
      // this should return the memory usage of the media
      // and maybe some info about how much space is left
      // before crashing the browser
    }
  }))
  .actions(self => {
    // TODO: should also double check for duplicates (filename and size match)
    const addMedia = media => {};

    const removeMedia = media_id => {};

    return {
      addMedia,
      removeMedia
    };
  });

export default MediaLibrary;
