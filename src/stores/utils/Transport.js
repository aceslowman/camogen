import { getRoot, types, flow } from "mobx-state-tree";

const Transport = types
    .model('Transport',{
        frameclock: 0,
        playing: false,
        recording: false
    })
    .volatile(self => ({
        recorder: null,
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

            if(self.recording) {                
                let stream = canvas.captureStream(30);
                self.recorder = new MediaRecorder(stream);
                self.recorder.start();
                console.log('recorder started')

                self.recorder.onstop = (e) => {
                    var blob = new Blob(self.chunks, { 'type' : 'video/mp4' });
                    self.clearChunks();
                    var videoURL = URL.createObjectURL(blob);

                    fetch(videoURL).then(r => r.blob()).then(blobFile => {
//                         let path = `${app.getPath("userData")}/snapshots`;

//                         let options = {
//                             defaultPath: path,
//                             buttonLabel: "Save Video",
//                         }

//                         function toArrayBuffer(blob, cb) {
//                             let fileReader = new FileReader();
//                             fileReader.onload = function () {
//                                 let arrayBuffer = this.result;
//                                 cb(arrayBuffer);
//                             };
//                             fileReader.readAsArrayBuffer(blob);
//                         }

//                         function toBuffer(ab) {
//                             return Buffer.from(ab);
//                         }

//                         toArrayBuffer(new Blob([blobFile], {type: 'video/mp4'}), (b) => {
//                             dialog.showSaveDialog(options).then(f => {
//                                 let buffer = toBuffer(b)
//                                 fs.writeFile(f.filePath, buffer, "base64", (err) => {
//                                     if (err) {
//                                         console.log("an error has occurred: " + err.message);
//                                     } else {
//                                         console.log("video saved", f.filePath);
//                                     }
//                                 });
//                             }).catch(err => {
//                                 console.error(err)
//                             });
//                         })
                    });                 
                }

                self.recorder.ondataavailable = (e) => {
                    self.chunks.push(e.data);
                }
            } else {
                self.recorder.stop();
                console.log('recorder stopped')
            }
        })

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
            incrementClock
        }
    })

export default Transport;