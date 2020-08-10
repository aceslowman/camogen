import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBarComponent';
import ShaderGraphComponent from './components/ShaderGraphComponent';
import ShaderControlsComponent from './components/ShaderControlsComponent';
// import Shelf from './components/ShelfComponent';
import DebugInfoComponent from './components/DebugInfoComponent';
import HelpComponent from './components/HelpComponent';
// import Panel from './components/PanelComponent';
import PanelGroup from './components/ui/PanelGroupComponent';
import ShaderEditorComponent from './components/ShaderEditorComponent';
import ParameterEditorComponent from './components/ParameterEditorComponent';
// import NodeDataComponent from './components/NodeDataComponent';

// for electron
const remote = window.require('electron').remote;
const app = remote.app;

export default @observer class App extends React.Component {

  workAreaRef = React.createRef();

  handleResize = () => {
    if(this.store.breakoutControlled) return;
    
    let bounds = this.workAreaRef.current.getBoundingClientRect();

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

  render() {
    this.store = this.props.store;

    let scene = this.store.scenes[0];

    return (    
      <MainProvider value={{store: this.store}}>
        <div id="APP">          
          <div id="WORKAREA">    
            <div id="WORKAREA_inner" ref={this.workAreaRef}>

                {this.store.ready && 
                  (
                    <PanelGroup>
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
                      })}
                    </PanelGroup>                    
                  )
                }                                            
            </div>          
            <ConsoleBar data={this.store.console}/>
          </div>         
        </div>
      </MainProvider>
    );
  }
};