import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBarComponent';
import ShaderGraph from './components/ShaderGraphComponent';
import Shelf from './components/ShelfComponent';
import DebugInfo from './components/DebugInfoComponent';
import Help from './components/HelpComponent';
import Panel from './components/PanelComponent';
import PanelGroup from './components/PanelGroupComponent';
import Editor from './components/EditorComponent';
import NodeDataComponent from './components/NodeDataComponent';

// for electron
const remote = window.require('electron').remote;
const app = remote.app;

export default @observer class App extends React.Component {

  workAreaRef = React.createRef();

  handleResize = () => {
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
                      { !app.isPackaged && <DebugInfo collapsed /> }
                      <Help />      
                    
                      <ShaderGraph data={scene.shaderGraphs[0]} />                      
                        <Panel 
                            title="Effect Controls"			                        
                            style={{minWidth:'200px'}}
                        >                
                          <Shelf>
                            {scene.shaderGraphs[0].nodesArray.map((n,j)=>(
                              n.data &&
                              <NodeDataComponent
                                key={j}
                                data={n.data}							
                              />
                            ))}                        
                          </Shelf>
                        </Panel>
                      <Editor data={scene.shaderGraphs[0].currentlyEditing} />                      
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