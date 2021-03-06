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
  ["SHADER_GRAPH", ShaderGraphComponent],
  ["SHADER_EDITOR", ShaderEditorComponent],
  ["SHADER_CONTROLS", ShaderControlsComponent],
  ["PREFERENCES", PreferencesComponent],
  ["PARAMETER_EDITOR", ParameterEditorComponent],
  ["OPERATOR_GRAPH", OperatorGraphComponent],
  ["OPERATOR_CONTROLS", OperatorControlsComponent],
  ["HELP", HelpComponent],
  ["MESSAGES", MessagesComponent],
  ["DEBUG", DebugInfoComponent]
]);