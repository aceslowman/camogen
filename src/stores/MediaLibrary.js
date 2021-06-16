import {
  types,
  flow,
  getParent,
  getSnapshot,
  applySnapshot
} from "mobx-state-tree";
import { nanoid } from "nanoid";

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
    content: null,
    
  }))
  .actions(self => {
    const loadContent = () => {
      console.log("loading content", self);

      //         // revoke previous url!
      //         if (self.dataURL) URL.revokeObjectURL(self.dataURL);

      //               if (!self.type.startsWith("image/")) return;

      //               var reader = new FileReader();

      //               reader.onload = e => {
      //                 var image = document.createElement("img");
      //                 self.setAsset(e.target.result);
      //                 self.setUserFilename(self.name);
      //               };

      //               reader.readAsDataURL(file);
      //               // dataURL helps retrieve the image for other places in the ui
      //               self.dataURL = URL.createObjectURL(file);
      //               console.log("URL.createObjectURL()", URL.createObjectURL(file));
    };

    return {
      loadContent
    };
  });

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
