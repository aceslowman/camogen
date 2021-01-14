import { nanoid } from "nanoid";
import {
  types,
  applySnapshot,
  getSnapshot,
  clone,
  detach
} from "mobx-state-tree";
import GraphNode from "../NodeStore";

const Clipboard = types
  .model("Clipboard", {
    selection: types.array(types.safeReference(GraphNode)),
    buffer: types.array(GraphNode)
  })
  .volatile(self => ({
    
  }))
  .actions(self => ({
    copy: () => {
      self.buffer = [];
      self.selection.forEach((e, i) => {
        let snap = { ...getSnapshot(e) };
        // clone
        self.buffer.push(
          GraphNode.create({
            ...snap,
            data: {
              ...snap.data,
              uniforms: snap.data.uniforms.map((e, i) => ({
                ...e,
                uuid: nanoid()
              }))
            },
            uuid: nanoid()
          })
        );
      });
      console.log("copied selection to buffer", getSnapshot(self.buffer));
    },
    cut: () => {
      console.log("cutting selection and copying to buffer");
    },
    paste: () => {
      console.log(
        `pasting buffer (${self.buffer[0].name}) to selection (${self.selection[0].name})`
      );

      // before pasting

      // if the node in the buffer has no parent,
      // then the node in selection should have no parent
      // else,

      applySnapshot(self.selection[0], {
        ...getSnapshot(self.buffer[0]),
        uuid: self.selection[0].uuid,
        children: self.selection[0].children,
        parents: self.selection[0].parents
      });

      // INIT ALMOST WORKS, but it refreshes default values...
      // self.selection[0].data.init();
      self.selection[0].data.refresh();
    },
    select: n => {
      self.selection = [];
      self.selection.push(n.uuid);
    },
    addSelection: n => {
      self.selection.push(n.uuid);      
    },
    removeSelection: n => {
      self.selection = self.selection.filter(e => e !== n);      
    },
    clear: () => {
      self.selection.clear();
      self.buffer.clear();
    }
  }));

export default Clipboard;