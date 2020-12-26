import { getRoot, types, flow } from "mobx-state-tree";
import { undoManager } from "../UndoManager";

const Transport = types
  .model("Transport", {
    frameclock: 0,
    playing: false,
    recording: false
  })
  .volatile(self => ({
    recorder: null,
    stream: null,
    recordingTime: 0,
    chunks: [],
    recordStart: null
  }))
  .views(self => ({}))
  .actions(self => {
    let store_root;

    const afterAttach = () => {
      store_root = getRoot(self);
    }

    const play = () => {
      self.playing = true;
      if (self.recorder && self.recording) self.recorder.resume();
    }

    const stop = () => {
      self.playing = false;
      if (self.recorder && self.recording) self.recorder.pause();
    }

    const record = flow(function* record() {
      let canvas = store_root.p5_instance.canvas;
      self.recording = !self.recording;
      console.log("recording started");

      if (self.recording) {
        if (!self.stream) self.stream = canvas.captureStream(30);
        // self.stream = canvas.captureStream(0);

        let mimeType;

        if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
          console.log("using webm video!");
          mimeType = "video/webm;codecs=h264";
        } else {
          console.log("using mp4!");
          mimeType = "video/mp4";
        }

        if (!self.recorder)
          self.recorder = new MediaRecorder(self.stream, {
            // audioBitsPerSecond: 128000,
            videoBitsPerSecond: 25000000, // still have some questions about this...
            mimeType: mimeType
          });

        self.recorder.start();
        self.recordStart = new Date();

        self.recorder.onstop = e => {
          console.log("stopping...");
          var blob = new Blob(self.chunks, { type: "video/webm" });

          var videoURL = URL.createObjectURL(blob);

          let link = document.createElement("a");
          link.download = `${store_root.name}`;

          if (window.webkitURL != null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            link.href = videoURL;
          } else {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            link.href = videoURL;
            link.onclick = e => {
              document.body.removeChild(e.target);
            };
            link.style.display = "none";
            document.body.appendChild(link);
          }

          link.click();

          self.clearChunks();
        };

        self.recorder.ondataavailable = e => {
          self.chunks.push(e.data);
        };
      } else {
        self.recorder.stop();
        console.log("recorder stopped");
      }
    });

    const snapshot = flow(function* snapshot(format = "PNG") {
      /*
        saves an image of the current scene
      */
      console.log("saving snapshot");
      let uri;

      switch (format) {
        case "PNG":
          uri = store_root.p5_instance.canvas.toDataURL("image/png");
          break;
        case "JPEG":
          let quality = 10;
          uri = store_root.p5_instance.canvas.toDataURL("image/jpeg", quality);
          break;
        default:
          uri = store_root.p5_instance.canvas.toDataURL("image/png");
      }

      let link = document.createElement("a");
      link.download = `${store_root.name}`;

      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        link.href = uri;
      } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        link.href = uri;
        link.onclick = e => {
          document.body.removeChild(e.target);
        };
        link.style.display = "none";
        document.body.appendChild(link);
      }

      link.click();
    });

    const clearChunks = () => {
      self.chunks = [];
    }

    const skipToStart = () => {
      self.frameclock = 0;
    }

    const incrementClock = () => {
      self.frameclock++;
    }

    return {
      afterAttach,
      play,
      stop,
      record,
      clearChunks,
      skipToStart,
      snapshot,
      incrementClock,
      // afterAttach: () => undoManager.withoutUndo(afterAttach),
      // play: () => undoManager.withoutUndo(play),
      // stop: () => undoManager.withoutUndo(stop),
      // record: () => undoManager.withoutUndoFlow(record),
      // clearChunks: () => undoManager.withoutUndo(clearChunks),
      // skipToStart: () => undoManager.withoutUndo(skipToStart),
      // snapshot: f => undoManager.withoutUndoFlow(() => snapshot(f)),
      // incrementClock: () => undoManager.withoutUndo(incrementClock)
    };
  });

export default Transport;
