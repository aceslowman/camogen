import { observable, action } from 'mobx';
import Runner from './Runner';
import p5 from 'p5';
import {
  serialize,
} from "serializr";
import ShaderStore from './stores/ShaderStore';
import SceneStore from './stores/SceneStore';

// operators
import Add from './stores/ops/Add';
import Counter from './stores/inputs/Counter'; // should be in ops?
import MIDI from './stores/inputs/MIDI';

// inputs
import ImageInput from './stores/inputs/ImageInput';
import WebcamInput from './stores/inputs/WebcamInput';

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
  
  /* 
    populated automatically using the
    loadShaderFiles() function. 
  */
  @observable shader_list = {};

  @observable input_list = {
    'ImageInput': ImageInput,
    'WebcamInput': WebcamInput,
  };

  @observable operator_list = {
    'Add': Add,
    'Counter': Counter,
    'MIDI': MIDI,
  };

  @observable scene = null;

  @observable ready = false;

  @observable breakoutControlled = false;

  @observable openPanels = [];

  @observable selectedParameter = null;

  constructor() {  
    this.loadShaderFiles().then(() => {      
      this.p5_instance = new p5(p => Runner(p, this));
      this.scene = new SceneStore(this);
      this.ready = true;

      // this.addPanel('Help');
      this.addPanel('Shader Graph');
      // this.addPanel('Shader Editor');
      this.addPanel('Shader Controls');
    });
  }

  /*
    loadShaderFiles()

    loads all custom shaders from the users directory

    if no factory shaders are found, they will be automatically
    loaded from `default_shaders_path`. 

    the user shaders are located at:
    
      macOS: ~/Library/Application Support
      Linux: ~/.config
      Windows: %APPDATA%
  */
  @action async loadShaderFiles() {
    let default_shaders_path = app.isPackaged 
      ? path.join(app.getAppPath(), '../shaders')
      : path.join(app.getAppPath(), 'shaders');
    let user_shaders_path = path.join(app.getPath("userData"),'shaders');

    try {
      // check if path exists
      await fs.promises.access(user_shaders_path) 

      let files = await fs.promises.readdir(user_shaders_path);

      // add each shader from nested folders
      await Promise.all(files.map(async (filename) => {
        let filepath = user_shaders_path + '/' + filename;

        // console.log(filename, fs.lstatSync(filepath).isDirectory())
        
        if (fs.lstatSync(filepath).isDirectory()) {
          let sub_files = await fs.promises.readdir(filepath); 
          
          await Promise.all(sub_files.map(async f => {
            // console.log('subdirectory files', filepath + '/' + f)
            
            const data = JSON.parse(await fs.promises.readFile(filepath+'/'+f));

            // get first part of filename
            // data.name = f.split('.')[0];
            this.shader_list = {
              ...this.shader_list,
              [filename]: {
                ...this.shader_list[filename],
                _isDirectory: true,
                [data.name]: data
              }
            }
          }))
        } else {
          const data = JSON.parse(await fs.promises.readFile(filepath));
          data.name = filename.split('.')[0];
          this.shader_list = {
            ...this.shader_list,
            [data.name]: data
          }
        }
      }))
    } catch (err) { // if user data shaders doesn't exist    
      if(err) console.error(err)

      if(window.confirm('No shaders found. Import default shaders? (recommended)')){
        fs.promises.mkdir(user_shaders_path).catch(console.error);

        console.log('new directory created for shaders', user_shaders_path);
        console.log('copy default shaders from', default_shaders_path);

        let default_files = await fs.promises.readdir(default_shaders_path).catch(console.error);

        // copy default to user
        default_files.forEach((filename) => {
          fs.promises.copyFile(path.join(default_shaders_path, filename), path.join(user_shaders_path, filename))
        });

        await this.loadShaderFiles();
      }
    }  
  }

  /*
    removePanel(name)
  */
  @action removePanel(name) {
    let index = this.openPanels.indexOf(name);
    if (index > -1) {
      this.openPanels.splice(index, 1)
    }
  }

  /*
    addPanel(name)

    this method adds a panel component to the group
  */
  @action addPanel(name) {
    this.openPanels.push(name);
  }

  /*
    breakout()
  */
  @action breakout() {
    let new_window = window.open('/output_window.html');
    new_window.updateDimensions = (w,h) => this.onBreakoutResize(w,h);
    new_window.gl = this.p5_instance.canvas.getContext('2d');
    
    this.breakoutControlled = true;
  }

  @action onBreakoutResize(w,h) {
    console.log('new dimensions',[w,h])

    this.p5_instance.resizeCanvas(w,h);

    // update target dimensions
    for (let target_data of this.scenes[0].targets) {
      target_data.ref.resizeCanvas(w,h);
    }

    this.p5_instance.draw();
  }

  /*
    snapshot()

    saves a png of the current scene
  */
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
  issue I had
*/
const mainStore = new MainStore();
export default mainStore;

