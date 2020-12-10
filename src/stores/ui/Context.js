import { types } from "mobx-state-tree";
import tinykeys from "tinykeys";
import { observable } from 'mobx';

const Context = types
  .model("Context", {})
  .volatile(self => ({
    contextmenu: observable.deep({}),
    keylistener: tinykeys(window, {}),
    keymap: null
  }))
  .actions(self => ({
    setKeymap: keymap => {
      if (self.keylistener) self.keylistener();

      self.keymap = keymap;
      self.keylistener = tinykeys(window, self.keymap);
    },
    removeKeymap: () => self.keylistener(),
    setContextmenu: c => (self.contextmenu = c)
  }));

export default Context;
