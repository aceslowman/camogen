import { getRoot, types, flow } from "mobx-state-tree";

const Transport = types
  .model("Transport", {
    frameclock: 0,
    playing: false,
    recording: false
  })
  .volatile(self => ({
    recorder: null,
    stream: null,
    chunks: []
  }))
  .actions(self => {
    let store_root;

    function afterAttach() {
      store_root = getRoot(self);
    }

    function play() {
      self.playing = true;
      if (self.recorder && self.recording) self.recorder.resume();
    }

    function stop() {
      self.playing = false;
      if (self.recorder && self.recording) self.recorder.pause();
    }

    const record = flow(function* record() {
      let canvas = store_root.p5_instance.canvas;
      self.recording = !self.recording;
      console.log('recording started')

      if (self.recording) {
        self.stream = canvas.captureStream(30);
        // self.stream = canvas.captureStream(0);
        
        let mimeType;

        if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
          console.log('using webm video!')
          mimeType = "video/webm;codecs=h264";
        } else {
          console.log('using mp4!')
          mimeType = "video/mp4";          
        }
        
        self.recorder = new MediaRecorder(self.stream, {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 5000000,
          mimeType: mimeType
        });

        self.recorder.start();

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

    /*
      snapshot()

      saves an image of the current scene
    */
    const snapshot = flow(function* snapshot(format = "PNG") {
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

    function clearChunks() {
      self.chunks = [];
    }

    function skipToStart() {
      self.frameclock = 0;
    }

    function incrementClock() {
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
      incrementClock
    };
  });

export default Transport;
