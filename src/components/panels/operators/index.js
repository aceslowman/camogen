import CounterComponent from "./CounterComponent";
import FloatComponent from "./FloatComponent";
import MIDIComponent from "./MIDIComponent";

export const ShaderComponents = new Map([
  ["Image", ImageInputComponent],
  ["Sketch", SketchInputComponent],
  ["Text", TextInputComponent],
  ["Video", VideoInputComponent],
  ["Webcam", WebcamInputComponent]
]);
