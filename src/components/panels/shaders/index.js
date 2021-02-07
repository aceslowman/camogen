import ImageInputComponent from "./ImageInputComponent";
import SketchInputComponent from "./SketchInputComponent";
import TextInputComponent from "./TextInputComponent";
import VideoInputComponent from "./VideoInputComponent";
import WebcamInputComponent from "./WebcamInputComponent";

export const ShaderComponents = new Map([
  ["Image", ImageInputComponent],
  ["Sketch", SketchInputComponent],
  ["Text", TextInputComponent],
  ["Video", VideoInputComponent],
  ["Webcam", WebcamInputComponent]
]);
