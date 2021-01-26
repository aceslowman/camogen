import { types } from 'mobx-state-tree';
import {nanoid} from 'nanoid';

import * as _DefaultShader from './defaults/DefaultShader';

import _ImageInput from './inputs/ImageInput';
import _VideoInput from './inputs/VideoInput';
import _TextInput from './inputs/TextInput';
import _WebcamInput from './inputs/WebcamInput';
import _SketchInput from './inputs/SketchInput';

export const allShaders = types.union(
  _ImageInput,
  _VideoInput,
  _TextInput,
  _WebcamInput,
  _SketchInput
)

export const DefaultShader = _DefaultShader;
export const ImageInput = _ImageInput;
export const VideoInput = VideoInput;
export const TextInput = _TextInput;
export const WebcamInput = _WebcamInput;
export const SketchInput = _SketchInput;

/*

adding new shader effects:

needs to be massively simplified...

1. Create a new store in this folder.
2. Add that store to this file
3. Create a new component for the effect (components/panels/shaders)
4. Add component to ControlsComponent
5. Add to RootStore -> ShaderLibrary
6. Add to NodeStore
7. Add to ShaderGraphStore
*/