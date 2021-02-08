import ShaderGraphComponent from "./ShaderGraphComponent";
import ShaderEditorComponent from "./ShaderEditorComponent";
import ShaderControlsComponent from "./ShaderControlsComponent";
import PreferencesComponent from "./PreferencesComponent";
import ParameterEditorComponent from "./ParameterEditorComponent";
import OperatorGraphComponent from "./OperatorGraphComponent";
import OperatorControlsComponent from "./OperatorControlsComponent";
import HelpComponent from "./HelpComponent";
import MessagesComponent from "./MessagesComponent";
import DebugInfoComponent from "./DebugInfoComponent";

export const Panels = new Map([
  ["Shader Graph", ShaderGraphComponent],
  ["Shader Editor", ShaderEditorComponent],
  ["Shader Controls", ShaderControlsComponent],
  ["Preferences", PreferencesComponent],
  ["Parameter Editor", ParameterEditorComponent],
  ["Operator Graph", OperatorGraphComponent],
  ["Operator Controls", OperatorControlsComponent],
  ["Help", HelpComponent],
  ["Messages", MessagesComponent],
  ["Debug Info", DebugInfoComponent]
]);
