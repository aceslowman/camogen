import { observable, computed, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
import * as NODES from '../components/nodes';
import {
  createModelSchema,
  primitive,
  reference,
  list,
  object,
  identifier,
  serialize,
  deserialize
} from "serializr";
import Parameter from './Parameter';

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const win = remote.getCurrentWindow();

const fs = window.require('fs');
const path = require('path');

/*
    This class is responsible for parsing an individual
     shader configuration file, making it consumable     
      by the main Store.
*/

export default class Shader {
  uuid      = uuidv1();
  name      = "";
  uniforms  = [];
  precision = "";
  vert      = "";
  frag      = "";
  ref       = null;
  target    = null;
  parent    = null;

  constructor(type = null, parent = null) {
    if(type) this.load(type);

    this.parent = parent;

    // set up ref
    this.ref = this.parent.ref.createShader(
      this.vertex,
      this.fragment
    );

    for (let uniform_node in this.uniforms) {
      this.ref.setUniform(uniform_node.name, uniform_node.value);
    }
  }

  load(type = null) {  
    if(type){
      // look up built-in shader
      let obj = NODES.shaders[type];

      // old method
      this.name = obj.name;
      this.uniforms = obj.uniforms;
      this.parameter_graphs = [];

      for (let uniform of obj.uniforms) {

        if (uniform.elements) {
          for (let element of uniform.elements) {
            if (element.graph) {
              this.parameter_graphs.push(element.graph);
            }
          }
        } else if (uniform.graph) {
          this.parameter_graphs.push(uniform.graph);
        }
      }

      this.precision = obj.precision;
      this.vert = obj.vert;
      this.frag = obj.frag;
    }else{
      dialog.showOpenDialog().then((f) => {
        let content = f.filePaths[0];
        fs.readFile(content, 'utf-8', (err, data) => {
          if (err)
            alert("in error has occurred: " + err.message);
          
          let result = deserialize(Shader, JSON.parse(data));

          console.dir(result, { colors: true, depth: 10 })

          // i expect this to be a problem
          // Object.assign(this, result);

          // but this doesn't seem to work either,
          // doesn't seem to update within GraphicsRunner
          this.uuid = uuidv1();
          this.name = result.name;
          this.uniforms = result.uniforms;
          this.precision = result.precision;
          this.vert = result.vert;
          this.frag = result.frag;
        })
      }).catch(err => {
        alert(err);
      });
    }    
  }

  save() {
    let options = {
      title: 'testFile',
      defaultPath: app.getPath("desktop"),
      buttonLabel: "Save Shader File",
      // filters: [{
      //   name: 'Camo Shader Files',
      //   extensions: ['shader.camo']
      // }, ]
    }

    dialog.showSaveDialog(options).then((f) => {
      let content = JSON.stringify(serialize(this));

      fs.writeFile(f.filePath, content, (err) => {
        if (err)
          alert("in error has occurred: " + err.message);
      });
    }).catch(err => {
      alert(err);
    });
  }

  get vertex(){
    return this.precision + this.vert;  
  } 
  get fragment(){
    return this.precision + this.frag;  
  } 
}

decorate(Shader, {
  uuid: observable,
  name: observable,
  uniforms: observable,
  precision: observable,
  vert: observable,
  frag: observable,
  vertex: computed,
  fragment: computed,
});

createModelSchema(Shader, {
  uuid: identifier(),  
  name: primitive(),
  uniforms: list(object(Parameter)),
  precision: primitive(),
  vert: primitive(),
  frag: primitive(),
});