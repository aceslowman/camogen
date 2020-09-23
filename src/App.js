import React, { useEffect, useRef } from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';

import ShaderGraphComponent from './components/panels/ShaderGraphComponent';
import ShaderControlsComponent from './components/panels/ShaderControlsComponent';
import DebugInfoComponent from './components/panels/DebugInfoComponent';
import HelpComponent from './components/panels/HelpComponent';
import ShaderEditorComponent from './components/panels/ShaderEditorComponent';
import ParameterEditorComponent from './components/panels/ParameterEditorComponent';
import MessagesComponent from './components/panels/MessagesComponent';

import tinykeys from 'tinykeys';
import {
  PanelComponent,
  ThemeContext,
  ToolbarComponent,
  SplitContainer
} from 'maco-ui';

import 'maco-ui/dist/index.css';
import { getSnapshot } from 'mobx-state-tree';

import path from 'path';
import PreferencesComponent from './components/panels/PreferencesComponent';

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
    if(!props.store.p5_instance) return;
    
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

  const getPanel = (name, key, defaultSize) => {
    switch (name) {
      case 'Shader Graph':                            
        return (<ShaderGraphComponent 
            key={key}
            data={props.store.scene.shaderGraph}
            defaultSize={defaultSize}
          />
        );
      case 'Shader Editor':                            
        return (<ShaderEditorComponent 
            key={key}
            node={props.store.scene.shaderGraph.selectedNode}
            data={props.store.scene.shaderGraph.selectedNode.data}
            graph={props.store.scene.shaderGraph}
            hasChanged={props.store.scene.shaderGraph.selectedNode.data.hasChanged}
            defaultSize={defaultSize}
          />
        );
      case 'Shader Controls':                            
        return (<ShaderControlsComponent 
            key={key}
            data={props.store.scene.shaderGraph}
            defaultSize={defaultSize}
          />
        );
      case 'Parameter Editor':  
        return (<ParameterEditorComponent 
            key={key}
            data={props.store.selectedParameter}
            defaultSize={defaultSize}
          />
        );
      case 'Help':                            
        return (<HelpComponent 
            key={key}   
            defaultSize={defaultSize}         
          />
        );
      case 'Debug':                            
        return (<DebugInfoComponent 
            key={key}  
            defaultSize={defaultSize}         
          />
        );         
      case 'Messages':                            
        return (<MessagesComponent 
            key={key}     
            data={props.store.messages}
            log={props.store.messages.log} 
            defaultSize={defaultSize}
          />
        );  
      case 'Preferences':                            
        return (<PreferencesComponent
            key={key} 
          />
        );                             
      default:
        break;
    }
  }

  const main_panel_toolbar = (
    <ToolbarComponent 
        items={[
          {
            label: "File",
            dropDown: [{
              label: "Save Scene",
              onClick: () => props.store.save()
            }, {
              label: "Load Scene",
              onClick: () => props.store.load()
            }, {
              label: "Preferences",
              onClick: () => {
                props.store.workspace.clear();
                props.store.workspace.addPanel("Preferences")
              }
            },            
          ]
          },
          {
            label: "New Scene",
            onClick: () => {
              console.log(getSnapshot(props.store.scene))
              props.store.scene.clear()
            }
          },     
          {
            label: "Library",
            dropDown: () => [{
                label: "Inputs",
                dropDown: [{
                    label: "Webcam",
                    onClick: () => props.store.scene.shaderGraph.setSelectedByName("WebcamInput")
                  },
                  {
                    label: "Image",
                    onClick: () => props.store.scene.shaderGraph.setSelectedByName("ImageInput")
                  },
                ]
              },
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
            label: "Workspace",
            dropDown: [
              {
                label: "Welcome",
                onClick: () => props.store.workspace.setWorkspace("Welcome")
              },
              {
                label: "Shader Edit",
                onClick: () => props.store.workspace.setWorkspace("Shader Edit")
              },
              {
                label: "Shader Control",
                onClick: () => props.store.workspace.setWorkspace("Shader Control")
              },
              {
                label: "Parameter Editor",
                onClick: () => props.store.workspace.setWorkspace("Parameter")
              },
              {
                label: "Debug",
                onClick: () => props.store.workspace.setWorkspace("Debug")
              },
              {
                label: "Add Panel",
                dropDown: [{
                    label: "Shader Graph",
                    onClick: () => props.store.workspace.addPanel("Shader Graph")
                  },
                  {
                    label: "Shader Editor",
                    onClick: () => props.store.workspace.addPanel("Shader Editor")
                  },
                  {
                    label: "Shader Controls",
                    onClick: () => props.store.workspace.addPanel("Shader Controls")
                  },
                  {
                    label: "Parameter Editor",
                    onClick: () => props.store.workspace.addPanel("Parameter Editor")
                  },
                  {
                    label: "Help",
                    onClick: () => props.store.workspace.addPanel("Help")
                  },
                  {
                    label: "Debug",
                    onClick: () => props.store.workspace.addPanel("Debug")
                  },
                  {
                    label: "Messages",
                    onClick: () => props.store.workspace.addPanel("Messages")
                  },
                  {
                    label: "Preferences",
                    onClick: () => props.store.workspace.addPanel("Preferences")
                  },
                ]
              },              
            ]
          },        			
          {
            label: "Snapshot",
            onClick: () => props.store.snapshot()
          },
          {
            label: "Breakout",
            onClick: handleBreakout
          },
        ]}
      />
  );

  return (    
    <MainProvider value={{store: props.store}}>
      <ThemeContext.Provider value={props.store.theme}>
        <div id="APP" ref={mainRef}>          
          {props.store.ready && 
            (
              <PanelComponent
                title={(<h1>camogen</h1>)}
                horizontal 
                fullscreen={props.store.breakoutControlled}
                floating
                toolbar={main_panel_toolbar}
                collapsible
              >
                <SplitContainer 
                  horizontal
                  updateFlag={props.store.workspace.updateFlag}
                >
                  {props.store.workspace.panels.map((workspace,i)=>{

                    if(workspace.split !== 'none') {
                      return (
                        <SplitContainer
                          key={i}
                          horizontal={workspace.split === 'horizontal'}
                          vertical={workspace.split === 'vertical'}
                          updateFlag={props.store.workspace.updateFlag}
                          defaultSize={workspace.defaultSize}
                        >
                          {workspace.panels.map((subworkspace,j)=>{
                            return getPanel(subworkspace.name,'sub'+j, subworkspace.defaultSize)
                          })}
                        </SplitContainer>
                      )
                    }

                    // if name is present, grab panel                    
                    if(workspace.name) return getPanel(workspace.name,i, workspace.defaultSize);                  
                    
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