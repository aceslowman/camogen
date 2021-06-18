import {
  types,
  flow,
  getParent,
  getSnapshot,
  applySnapshot
} from "mobx-state-tree";
import { nanoid } from "nanoid";

/*
  MEDIA LIBRARY
  
  the media library stores assets to be used with any of the nodes
  nodes can reuse images this way, reducing the overhead 
  
  each media (image, video) node holds a reference to an asset held
  here.
*/

const Media = types
  .model("Media", {
    id: types.identifier,
    path: types.string,
    name: types.maybe(types.string),
    size: types.maybe(types.integer),
    type: types.maybe(types.string),
    dataURL: types.maybe(types.string)
  })
  .volatile(self => ({
    asset: null
  }))
  .views(self => ({
    getDimensions: () => {
      console.log("self asset", self.asset);
      return [self.asset.width, self.asset.height];
    }
  }))
  .actions(self => ({
    setAsset: asset => {
      self.asset = asset;
    }
  }));

const MediaLibrary = types
  .model("MediaLibrary", {
    id: types.identifier,
    media: types.map(Media)
  })
  .views(self => ({
    getInfo: () => {
      // this should return the memory usage of the media
      // and maybe some info about how much space is left
      // before crashing the browser
    },

    getTotalSize: () => {
      if (!self.media.size) return 0;
      console.log("check", Array.from(self.media.values()));
      return Array.from(self.media.values()).reduce((acc, curr) => {
        return acc + curr.size;
      }, 0);
    },

    getAllowedSize: () => {
      if (!self.media.size) return 0;
      console.log();
      return 100;
    }
  }))
  .actions(self => {
    // TODO: should also double check for duplicates (path and size match)
    const addMedia = media => {
      let media_id = nanoid();
      // if (!self.type.startsWith("image/")) return;

      var reader = new FileReader();

      reader.onload = e => {
        var image = document.createElement("img");
        self.media.get(media_id).setAsset(e.target.result);
      };

      reader.readAsDataURL(media);
      let dataURL = URL.createObjectURL(media);
      console.log("URL.createObjectURL()", URL.createObjectURL(media));

      self.media.put({
        id: media_id,
        path: media.path,
        name: media.name,
        size: media.size,
        type: media.type,
        dataURL: dataURL
      });
    };

    const removeMedia = media_id => {
      console.log("removing media", media_id);
    };

    return {
      addMedia,
      removeMedia
    };
  });

export default MediaLibrary;
