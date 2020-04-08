import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, decorate } from 'mobx';
import MainContext from '../MainContext';
import uuidv1 from 'uuid/v1';
import * as Parameter from './Parameter';
import * as NODES from './nodes';
import Node from './ui/Node';
import {
  createModelSchema,
  primitive,
  list,
  object,
  identifier,
  serialize,
  deserialize
} from "serializr";

// for electron
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
// const win = remote.getCurrentWindow();

const fs = window.require('fs');
// const path = require('path');

/*
    This class is responsible for parsing an individual
     shader configuration file, making it consumable     
      by the main Store.
*/

class ShaderStore {
  uuid      = uuidv1();
  name      = "";
  uniforms  = [];
  precision = "";
  vert      = "";
  frag      = "";
  ref       = null;
  target    = null;  

  constructor(type = null, target) {
    if(type) this.load(type); 

    this.target = target;

    this.ref = this.target.ref.createShader(
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
          
          let result = deserialize(
            ShaderStore, 
            JSON.parse(data), 
            (err, res) => {
              if(err) console.log(err);
              console.log(res);
            }
          );

          console.dir(result, { colors: true, depth: 10 })
          
          result.target = this.target;
          result.init();
          Object.assign(this, result);
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

decorate(ShaderStore, {
  uuid:      observable,
  target:    observable,
  name:      observable,
  uniforms:  observable,
  precision: observable,
  vert:      observable,
  frag:      observable,
  vertex:    computed,
  fragment:  computed,
});

createModelSchema(ShaderStore, {
  uuid:      identifier(),  
  target:    object(Parameter),
  name:      primitive(),
  uniforms:  list(object(Parameter)),
  precision: primitive(),
  vert:      primitive(),
  frag:      primitive(),
}, c => {
  let p = c.parentContext.target;
  return new ShaderStore(null,p);
});

class ShaderComponent extends React.Component {
	static contextType = MainContext;

	componentDidMount() {
		this.generateParameters();
	}

	generateParameters() {
		this.parameters = [];

		for (let param of this.props.data.uniforms) {			
			if (param.elements) {
				this.parameters.push((
					<fieldset 
						key={param.uuid}
						className="uniform_array"
					>
						<legend className="invert" style={{ padding: '2px 4px' }}>{param.name}</legend>
						<div>
							{/* TEMPORARY */}
							<Parameter 
								key={param.elements[0].uuid}
								data={param.elements[0]}							
							/>
							<Parameter 
								key={param.elements[1].uuid}
								data={param.elements[1]}							
							/>
						</div>
					</fieldset>
				));
			} else {
				this.parameters.push((
					<Parameter 
						key={param.uuid}
						data={param}							
					/>
				));
			}
		}
	}

	handleRemove = () => {
		this.props.target.removeShader(this.props.data);
	}

	handleSave = () => this.props.data.save();

	handleLoad = () => this.props.data.load();

	render() {
		const { data } = this.props;

		this.store = this.context.store;

		return(
			<Node 
				title={data.name}
				data={data} 
				onRemove={this.handleRemove}
				onSave={this.handleSave}
				onLoad={this.handleLoad}
				inlets={[{hint: "tex in"}]}
				outlets={[{hint: "tex out"}]}
			>	            
				{this.parameters}
			</Node>          		
	    )
	}
};

const store = ShaderStore;
const component = observer(ShaderComponent);

export {
  store,
  component
}