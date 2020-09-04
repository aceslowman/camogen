import { observable, action } from 'mobx';
import Runner from './Runner';
import p5 from 'p5';

// remove
import { serialize } from "serializr";

import { types } from "mobx-state-tree";

import ShaderStore from './stores/ShaderStore';
import { Scene } from './stores/SceneStore';

// operators
import Add from './stores/ops/Add';
import Counter from './stores/inputs/Counter'; // should be in ops?
import MIDI from './stores/inputs/MIDI';

// inputs
import ImageInput from './stores/inputs/ImageInput';
import WebcamInput from './stores/inputs/WebcamInput';
import ParameterStore from './stores/ParameterStore';
import { ShaderGraph } from './stores/ShaderGraphStore';

const path = require('path');

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

/*
  [RootStore]
  |
  [SceneStore]
  |
  [GraphStore] 
  |
  [ShaderGraph]
  |
  [NodeStore] 
  |
  [ShaderStore]  
  |
  [UniformStore]
  |
  [ParameterStore]
*/

const RootStore = types
  .model("RootStore", {    
    scene: types.maybe(Scene),
    openPanels: types.array(types.string),
    ready: false
  })
  .actions(self => {
    function afterCreate() {
      self.scene = Scene.create({});
      // self.openPanels.push('Shader Graph')
      console.log('created')
      self.ready = true;
    }

    return {
      afterCreate,
    };
  })

export default RootStore;