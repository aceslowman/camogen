import { observable, action } from 'mobx';
import Runner from './Runner';
import p5 from 'p5';
import {
  createModelSchema,
  list,
  object,
  serialize,
} from "serializr";
import ShaderStore from './stores/ShaderStore';
import ConsoleStore from './stores/ConsoleStore';
// import { create } from 'mobx-persist';
// import Graph from './stores/GraphStore';
// import ImageInput from './stores/inputs/ImageInput';
// import WebcamInput from './stores/inputs/WebcamInput';
import Scene from './stores/SceneStore';

// operators
import Add from './stores/ops/Add';
import Counter from './stores/inputs/Counter'; // should be in ops?
import MIDI from './stores/inputs/MIDI';

const path = require('path');

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = window.require('fs');

/*
                          [MainStore]
                              |
              [SceneStore] ------- [ConsoleStore] 
                   |
   [TargetStore] ----- [GraphStore] 
                            |
           [ShaderGraph] -- or -- [ParameterGraph]
                  |______________________|
                            |
                        [NodeStore] 
                            |
          [ShaderStore] -- or -- [OperatorStore] 
                |
          [UniformStore]
                |
        [ParameterStore]
*/

class MainStore {
  @observable p5_instance = null;
  
  // populated by loadShaderFiles()
  @observable shader_list = {};

  @observable input_list = {};

  // at this moment there are no
  // user-defined operators, so
  // operators can be loaded 
  // manually here.
  @observable operator_list = {
    'Add': Add,
    'Counter': Counter,
    'MIDI': MIDI,
  };

  @observable scenes = [];

  @observable console = new ConsoleStore();

  @observable ready = false;

  @observable activeScene = null;

  constructor() {  
    this.loadShaderFiles().then(() => {
      this.p5_instance = new p5(p => Runner(p, this));
      this.scenes.push(new Scene(this));
      this.ready = true;
    });
  }

  @action async loadShaderFiles() {
    let default_shaders_path = app.isPackaged 
      ? path.join(app.getAppPath(), '../shaders')
      : path.join(app.getAppPath(), 'shaders');
    let user_shaders_path = path.join(app.getPath("userData"),'shaders');

    try {
      await fs.promises.access(user_shaders_path) // check if path exists

      let files = await fs.promises.readdir(user_shaders_path);

      await Promise.all(files.map(async (type) => {
        const data = JSON.parse(await fs.promises.readFile(user_shaders_path + '/' + type));
        data.name = type.split('.')[0];
        this.shader_list = {
          ...this.shader_list,
          [data.name]: data
        }
      }))
    } catch (err) { // if user data shaders doesn't exist
      fs.promises.mkdir(user_shaders_path).catch(console.error);
      
      console.log('new directory created for shaders', user_shaders_path);
      console.log('copy default shaders from', default_shaders_path);

      let default_files = await fs.promises.readdir(default_shaders_path).catch(console.error);

      // copy default to user
      default_files.forEach((filename)=>{
        fs.promises.copyFile(path.join(default_shaders_path, filename), path.join(user_shaders_path,filename))
      });
      
      await this.loadShaderFiles();
    }  
  }

  @action removeScene(scene) {
    this.scene = this.scene.filter((item) => item !== scene);
    if (this.activeScene === scene) {
      this.activeScene = this.scene[0];
    }
  }

  @action breakout() {
    let new_window = window.open('/output_window.html');
    new_window.gl = this.p5_instance.canvas.getContext('2d'); 
    // new_window.dimensions = []
  }

  @action async snapshot() {
    var dataURL = this.p5_instance.canvas.toDataURL("image/png");

    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    var content = new Buffer(data, 'base64');
    
    let path = `${app.getPath("userData")}/snapshots`;

    const show_dialog = true;

    if (show_dialog) {
      let options = {
        title: this.name + '.shader',
        defaultPath: path,
        buttonLabel: "Save Shader File",
      }

      dialog.showSaveDialog(options).then((f) => {      
        fs.writeFile(f.filePath, content, "base64", (err) => {
          if (err) {
            console.log("an error has occurred: " + err.message);
          } else {
            console.log("snapshot saved",f.filePath);            
          }
        });
      }).catch(err => {
        console.error(err)
      });
    } else {
      let content = JSON.stringify(serialize(ShaderStore, this));

      let file = this.name + '.shader';

      fs.writeFile(`path/${file}`, content, "base64", (err, data) => {
        if (err) {
          console.log("an error has occurred: " + err.message);
        } else {
          console.log('saved!', data);
        }
      });
    }
  }
}

/* 
  for some reason this needs to be here, this 
  seems to be related to a circular dependency 
  issue i had
*/
const mainStore = new MainStore();
export default mainStore;

