import { types } from 'mobx-state-tree';
import {nanoid} from 'nanoid';

import * as _DefaultShader from './defaults/DefaultShader';

import _ImageInput from './inputs/ImageInput';
import _TextInput from './inputs/TextInput';
import _WebcamInput from './inputs/WebcamInput';
import _SketchInput from './inputs/SketchInput';

export const allShaders = types.union(
  _ImageInput,
  _TextInput,
  _WebcamInput,
  _SketchInput
)

export const DefaultShader = _DefaultShader;
export const ImageInput = _ImageInput;
export const TextInput = _TextInput;
export const WebcamInput = _WebcamInput;
export const SketchInput = _SketchInput;