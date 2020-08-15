import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ShaderGraphComponent from './components/ShaderGraphComponent';
import ShaderControlsComponent from './components/ShaderControlsComponent';
import DebugInfoComponent from './components/DebugInfoComponent';
import HelpComponent from './components/HelpComponent';
import ShaderEditorComponent from './components/ShaderEditorComponent';
import ParameterEditorComponent from './components/ParameterEditorComponent';

import {
  PanelComponent,
  ThemeContext,
  ToolbarComponent,
  Themes
} from 'maco-ui';

import 'maco-ui/dist/index.css';

export default @observer class App extends React.Component {

  mainRef = React.createRef();

  handleResize = () => {
    if(this.store.breakoutControlled) return;
    
    let bounds = this.mainRef.current.getBoundingClientRect();

    this.store.p5_instance.resizeCanvas(
      bounds.width,
      bounds.height
    );

    // update target dimensions
    for (let target_data of this.store.scenes[0].targets) {
      target_data.ref.resizeCanvas(
        bounds.width,
          bounds.height
      );
    }

    this.store.p5_instance.draw();
  }

  componentDidMount() {   
    window.addEventListener('resize', this.handleResize);
  }

  handleBreakout = () => {
    this.store.breakout();
    this.handleExpand(true);
  };

  handleLib = () => {
		let keys = Object.keys(this.store.shader_list);

		keys.sort((a,b)=>{
			return a._isDirectory ? 1 : -1
		})

		return keys.map((name)=>{
			let item = this.store.shader_list[name];

			if (item._isDirectory) {
				let subItems = [];

				for (let name in item) {
					if (name == '_isDirectory') continue;
					subItems.push({
						label: name,
						onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName(name)
					});
				}

				return {
					_isDirectory: true,
					label: name,					
					items: subItems
				};
			} else {
				return {
					label: item.name,
					onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName(item.name)
				};
			}
		});
  }

  render() {
    this.store = this.props.store;

    const main_panel_toolbar = (
      <ToolbarComponent 
          items={[
            {
              label: "FILE",
              dropDown: [
                {
                  label: "Save Scene",
                  onClick: ()=>this.store.scenes[0].save()
                }, {
                  label: "Load Scene",
                  onClick: ()=>this.store.scenes[0].load()
                },
              ]
            },	
            {
              label: "PANELS",
              dropDown: [
                {
                  label: "Shader Graph",
                  onClick: () => this.store.addPanel("Shader Graph")
                },
                {
                  label: "Shader Editor",
                  onClick: () => this.store.addPanel("Shader Editor")
                },
                {
                  label: "Shader Controls",
                  onClick: () => this.store.addPanel("Shader Controls")
                },  
                {
                  label: "Parameter Editor",
                  onClick: () => this.store.addPanel("Parameter Editor")
                },
                {
                  label: "Help",
                  onClick: () => this.store.addPanel("Help")
                },
                {
                  label: "Debug",
                  onClick: () => this.store.addPanel("Debug")
                },
              ]
            },
            {
              label: "LIBRARY",
              dropDown: this.handleLib()
            },
            {
              label: "INPUTS",
              dropDown: [
                {
                  label: "WEBCAM",
                  onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName("WebcamInput")
                },
                {
                  label: "IMAGE",
                  onClick: () => this.store.scenes[0].shaderGraphs[0].setSelectedByName("ImageInput")
                },
              ]
            },
            {
              label: "CLEAR",
              onClick: () => this.store.scenes[0].clear()
            },						
            {
              label: "SNAPSHOT",
              onClick: this.store.snapshot
            },
            {
              label: "BREAKOUT",
              onClick: this.handleBreakout
            },
          ]}
        />
    );

    return (    
      <MainProvider value={{store: this.store}}>
        <ThemeContext.Provider value={Themes.yutani}>
          <div id="APP" ref={this.mainRef}>          
            {this.store.ready && 
              (
                <PanelComponent
                  title={(<h1>camogen</h1>)}
                  horizontal 
                  fullscreen
                  floating
                  toolbar={main_panel_toolbar}
                >
                  {this.store.openPanels.map((name,i)=>{
                    switch (name) {
                      case 'Shader Graph':                            
                        return (<ShaderGraphComponent 
                            key={i}
                            data={this.store.scenes[0].shaderGraphs[0]}
                          />
                        );
                      case 'Shader Editor':                            
                        return (<ShaderEditorComponent 
                            key={i}
                            data={this.store.scenes[0].shaderGraphs[0].currentlyEditing}
                          />
                        );
                      case 'Shader Controls':                            
                        return (<ShaderControlsComponent 
                            key={i}
                            data={this.store.scenes[0].shaderGraphs[0]}
                          />
                        );
                      case 'Parameter Editor':  
                        return (<ParameterEditorComponent 
                            key={i}
                            data={this.store.selectedParameter}
                          />
                        );
                      case 'Help':                            
                        return (<HelpComponent 
                            key={i}            
                          />
                        );
                      case 'Debug':                            
                        return (<DebugInfoComponent 
                            key={i}           
                          />
                        );                             
                      default:
                        break;
                    }

                    return null;
                  })}
                </PanelComponent>                    
              )
            }                                            
          </div>          
        </ThemeContext.Provider>        
      </MainProvider>
    );
  }
};