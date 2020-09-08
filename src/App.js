import React, { useEffect, useRef } from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';

import ShaderGraphComponent from './components/panels/ShaderGraphComponent';
import ShaderControlsComponent from './components/panels/ShaderControlsComponent';
import DebugInfoComponent from './components/panels/DebugInfoComponent';
import HelpComponent from './components/panels/HelpComponent';
import ShaderEditorComponent from './components/panels/ShaderEditorComponent';
import ParameterEditorComponent from './components/panels/ParameterEditorComponent';

import tinykeys from 'tinykeys';
import {
  PanelComponent,
  ThemeContext,
  ToolbarComponent,
  SplitContainer,
  Themes
} from 'maco-ui';

import 'maco-ui/dist/index.css';
import { getSnapshot } from 'mobx-state-tree';

import path from 'path';
const shell = window.require('electron').shell;
const remote = window.require('electron').remote;
const app = remote.app;

const App = observer((props) => {

  const mainRef = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    let unsubscribe = tinykeys(window, {
      "$mod+KeyZ": () => {
        console.log('undo')
        if(props.history.canUndo) {
          console.log('HISTORY', getSnapshot(props.history))
          props.history.undo();
        } else {
          console.log('all out of undo')
        }
      },
      "$mod+Shift+KeyZ": () => {
        console.log('redo')
        if(props.history.canRedo) {
          console.log('HISTORY', getSnapshot(props.history))
          props.history.redo();
        } else {
          console.log('all out of redo')
        }
      },
      "$mod+KeyS": () => {
        props.store.save();
      },
      "$mod+KeyO": () => {
        props.store.load();
      },
    });

    return unsubscribe;
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

    // props.store.p5_instance.draw();
  }

  const handleBreakout = () => {
    props.store.breakout();
  };

  /*
    currently limited to two levels, just haven't figured out the best
    way to traverse and remap the directory tree
  */
  const handleLib = () => {
    let collection = props.store.shader_collection;

    let items = [];

    collection.children.forEach((e,i) => {
      if (e.type === 'file') {
        items.push({
          label: e.name,
          onClick: () => props.store.scene.shaderGraph.setSelectedByName(e.name)
        })
      } else if (e.type === 'directory') {
        let subitems = e.children.map((c)=>{
          let next = {
            label: c.name,
            onClick: () => props.store.scene.shaderGraph.setSelectedByName(c.name)
          };

          return next;
        })

        items.push({
          label: e.name,
          dropDown: subitems
        })
      }
    })

    return items;
  }

  const main_panel_toolbar = (
    <ToolbarComponent 
        items={[
          {
            label: "FILE",
            dropDown: [
              {
                label: "Save Scene",
                onClick: ()=>props.store.save()
              }, {
                label: "Load Scene",
                onClick: ()=>props.store.load()
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
            dropDown: () => [
              ...handleLib(),
              {
                label: "*Open Directory*",
                onClick: () => {
                  let user_shaders_path = path.join(app.getPath("userData"), 'shaders');
                  shell.openItem(user_shaders_path)
                }
              },
            ]
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
            onClick: () => props.store.scene.clear()
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
                            graph={props.store.scene.shaderGraph}
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