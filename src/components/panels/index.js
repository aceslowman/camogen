import ShaderGraphComponent from "./ShaderGraphComponent";
import ShaderEditorComponent from "./ShaderEditorComponent";
import ShaderControlsComponent from "./ShaderControlsComponent";
import PreferencesComponent from "./PreferencesComponent";
import ParameterEditorComponent from "./ParameterEditorComponent";

export const Panels = new Map([
  ["Shader Graph", ShaderGraphComponent],
  ["Shader Editor", ShaderEditorComponent],
  ["Shader Controls", ShaderControlsComponent],
  ["Preferences", PreferencesComponent],
  ["Parameter Editor", ParameterEditorComponent],
]);