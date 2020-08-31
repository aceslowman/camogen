import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';

import ShaderGraphComponent from './components/panels/ShaderGraphComponent';
import ShaderControlsComponent from './components/panels/ShaderControlsComponent';
import DebugInfoComponent from './components/panels/DebugInfoComponent';
import HelpComponent from './components/panels/HelpComponent';
import ShaderEditorComponent from './components/panels/ShaderEditorComponent';
import ParameterEditorComponent from './components/panels/ParameterEditorComponent';

import {
  PanelComponent,
  ThemeContext,
  ToolbarComponent,
  SplitContainer,
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
						onClick: () => this.store.scene.shaderGraph.setSelectedByName(name)
					});
				}

				return {
					label: name,					
					dropDown: subItems
				};
			} else {
				return {
					label: item.name,
					onClick: () => this.store.scene.shaderGraph.setSelectedByName(item.name)
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
                  onClick: () => this.store.scene.shaderGraph.setSelectedByName("WebcamInput")
                },
                {
                  label: "IMAGE",
                  onClick: () => this.store.scene.shaderGraph.setSelectedByName("ImageInput")
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
                  <SplitContainer horizontal>
                    {this.store.openPanels.map((name,i)=>{
                      switch (name) {
                        case 'Shader Graph':                            
                          return (<ShaderGraphComponent 
                              key={i}
                              data={this.store.scene.shaderGraph}
                            />
                          );
                        case 'Shader Editor':                            
                          return (<ShaderEditorComponent 
                              key={i}
                              data={this.store.scene.shaderGraph.currentlyEditing}
                            />
                          );
                        case 'Shader Controls':                            
                          return (<ShaderControlsComponent 
                              key={i}
                              data={this.store.scene.shaderGraph}
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
                  </SplitContainer>                                   
                </PanelComponent>                    
              )
            }                                            
          </div>          
        </ThemeContext.Provider>        
      </MainProvider>
    );
  }
};