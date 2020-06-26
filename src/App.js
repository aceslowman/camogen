import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBarComponent';
import Graph from './components/graph/GraphComponent';
import Shelf from './components/shelf/ShelfComponent';
import DebugInfo from './components/DebugInfoComponent';
import Help from './components/HelpComponent';
import PanelGroup from './components/ui/PanelGroupComponent';
import Editor from './components/ui/EditorComponent';

import Shader from './components/ShaderComponent';

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

    return (    
      <MainProvider value={{store: this.store}}>
        <div id="APP">          
          <div id="WORKAREA">    
            <div id="WORKAREA_inner" ref={this.workAreaRef}>

                {this.store.ready && this.store.scenes[0].shaderGraphs.map((graph,i)=>{
                  return (
                    <PanelGroup key={i}>
                      { !app.isPackaged && <DebugInfo collapsed /> }
                      <Help />                      
                      <Shelf
                        key={i+'shelf'} 
                        data={graph}
                      >
                        {graph.nodesArray.map((n,j)=>(
                          n.data &&
                          <Shader
                            key={j}
                            data={n.data}							
                       />
                        ))}                        
                      </Shelf>
                      <Graph
                        key={i+'graph'} 
                        data={graph}
                      />                      
                      <Editor 
                        key={i+'editor'}
                        data={this.store.scenes[0].currentlyEditing}
                        data={this.store.scenes[0].currentlyEditing}
                      />                      
                    </PanelGroup>                    
                  );
                })} 
                                           
            </div>          
            <ConsoleBar data={this.store.console}/>
          </div>         
        </div>
      </MainProvider>
    );
  }
};