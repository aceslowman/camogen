import React, { useEffect, useRef } from 'react';
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

const App = observer((props) => {

  const mainRef = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if(props.store.breakoutControlled) return;
    
    let bounds = mainRef.current.getBoundingClientRect();

    props.store.p5_instance.resizeCanvas(
      bounds.width,
      bounds.height
    );

    // update target dimensions
    for (let target_data of props.store.scene.targets) {
      target_data.ref.resizeCanvas(
        bounds.width,
          bounds.height
      );
    }

    props.store.p5_instance.draw();
  }

  const handleBreakout = () => {
    props.store.breakout();
  };

  const handleLib = () => {
		let keys = Object.keys(props.store.shader_list);

		keys.sort((a,b)=>{
			return a._isDirectory ? 1 : -1
		})

		return keys.map((name)=>{
			let item = props.store.shader_list[name];

			if (item._isDirectory) {
				let subItems = [];

				for (let name in item) {
					if (name == '_isDirectory') continue;
					subItems.push({
						label: name,
						onClick: () => props.store.scene.shaderGraph.setSelectedByName(name)
					});
				}

				return {
					label: name,					
					dropDown: subItems
				};
			} else {
				return {
					label: item.name,
					onClick: () => props.store.scene.shaderGraph.setSelectedByName(item.name)
				};
			}
		});
  }

  const main_panel_toolbar = (
    <ToolbarComponent 
        items={[
          {
            label: "FILE",
            dropDown: [
              {
                label: "Save Scene",
                onClick: ()=>props.store.scenes[0].save()
              }, {
                label: "Load Scene",
                onClick: ()=>props.store.scenes[0].load()
              },
            ]
          },	
          {
            label: "PANELS",
            dropDown: [
              {
                label: "Shader Graph",
                onClick: () => props.store.addPanel("Shader Graph")
              },
              {
                label: "Shader Editor",
                onClick: () => props.store.addPanel("Shader Editor")
              },
              {
                label: "Shader Controls",
                onClick: () => props.store.addPanel("Shader Controls")
              },  
              {
                label: "Parameter Editor",
                onClick: () => props.store.addPanel("Parameter Editor")
              },
              {
                label: "Help",
                onClick: () => props.store.addPanel("Help")
              },
              {
                label: "Debug",
                onClick: () => props.store.addPanel("Debug")
              },
            ]
          },
          {
            label: "LIBRARY",
            dropDown: handleLib()
          },
          {
            label: "INPUTS",
            dropDown: [
              {
                label: "WEBCAM",
                onClick: () => props.store.scene.shaderGraph.setSelectedByName("WebcamInput")
              },
              {
                label: "IMAGE",
                onClick: () => props.store.scene.shaderGraph.setSelectedByName("ImageInput")
              },
            ]
          },
          {
            label: "CLEAR",
            onClick: () => props.store.scenes[0].clear()
          },						
          {
            label: "SNAPSHOT",
            onClick: props.store.snapshot
          },
          {
            label: "BREAKOUT",
            onClick: handleBreakout
          },
        ]}
      />
  );

  return (    
    <MainProvider value={{store: props.store}}>
      <ThemeContext.Provider value={Themes.yutani}>
        <div id="APP" ref={mainRef}>          
          {props.store.ready && 
            (
              <PanelComponent
                title={(<h1>camogen</h1>)}
                horizontal 
                fullscreen
                floating
                toolbar={main_panel_toolbar}
              >
                <SplitContainer horizontal>
                  {props.store.openPanels.map((name,i)=>{
                    switch (name) {
                      case 'Shader Graph':                            
                        return (<ShaderGraphComponent 
                            key={i}
                            data={props.store.scene.shaderGraph}
                          />
                        );
                      case 'Shader Editor':                            
                        return (<ShaderEditorComponent 
                            key={i}
                            data={props.store.scene.shaderGraph.currentlyEditing}
                          />
                        );
                      case 'Shader Controls':                            
                        return (<ShaderControlsComponent 
                            key={i}
                            data={props.store.scene.shaderGraph}
                          />
                        );
                      case 'Parameter Editor':  
                        return (<ParameterEditorComponent 
                            key={i}
                            data={props.store.selectedParameter}
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
});

export default App;