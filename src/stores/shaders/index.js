import { types } from 'mobx-state-tree';
import {nanoid} from 'nanoid';

import _ImageInput from './inputs/ImageInput';
import _TextInput from './inputs/TextInput';
import _WebcamInput from './inputs/WebcamInput';

import * as _DefaultShader from './defaults/DefaultShader';

export const allShaders = types.union(
  _ImageInput,
  _TextInput,
  _WebcamInput
)

export const ImageInput = _ImageInput;
export const TextInput = _TextInput;
export const WebcamInput = _WebcamInput;
export const DefaultShader = _DefaultShader;