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
    // name: types.optional(types.string),
    path: types.string,
    // size: types.optional(types.integer),
    // type: types.optional(types.string),
  })
  .volatile(self => ({
    content: null
  }))
  .actions(self => {
    const loadContent = () => {
      console.log('loading content', self)
    }
    
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
      if (media.length) {
        for (let i = 0; i < media.length; i++) {
          console.log("adding media", media);
          let media_id = nanoid();
          
          self.media.put({
            id: media_id,
            path: media[i].path
            // ...media[i],            
          });
          
          self.media.get(media_id).loadContent();
        }
      } else {
      }

      // receiving [{"path":"DSCN2621.JPG"}]
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
