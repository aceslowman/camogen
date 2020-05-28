import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBar';
import ToolBar from './components/ToolBar';
// import ShaderGraph from './components/ShaderGraphComponent';
import Graph from './components/graph/GraphComponent';
import Shelf from './components/shelf/ShelfComponent';
import Splash from './components/Splash';
import DebugInfo from './components/DebugInfo';
import PanelGroup from './components/ui/PanelGroupComponent';
import Editor from './components/ui/EditorComponent';

import Shader from './components/ShaderComponent';

const App = observer(class App extends React.Component {

  constructor() {
    super();
    this.targets = [];
    this.workAreaRef = React.createRef();
  }

  handleResize = () => {
    let bounds = this.workAreaRef.current.getBoundingClientRect();

    this.store.p5_instance.resizeCanvas(
      bounds.width,
      bounds.height
    );

    // update target dimensions
    for (let target_data of this.store.targets) {
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
            <ToolBar />

            <div id="WORKAREA_inner" ref={this.workAreaRef}>
              { this.store.show_splash && <Splash /> }
              <div className="shaderGraphs">
                {/* {this.store.shaderGraphs.map((graph)=>{
                  return (
                    <ShaderGraph
                      key={graph.uuid} 
                      data={graph}
                    />
                  );
                })} */}
                {this.store.shaderGraphs.map((graph)=>{
                  return (
                    <PanelGroup key={graph.uuid}>
                      <Graph
                        key={graph.uuid+'graph'} 
                        data={graph}
                      />
                      <Shelf
                        key={graph.uuid+'shelf'} 
                        data={graph}
                      >
                        {graph.nodesArray.map((n)=>(
                          n.data &&
                          <Shader
                            key={n.uuid}
                            data={n.data}							
                          />
                        ))}                        
                      </Shelf>
                      <Editor />
                    </PanelGroup>                    
                  );
                })}
                {/* <DebugInfo /> */}
              </div>     
              
            </div>          

            <ConsoleBar />
          </div>         
        </div>
      </MainProvider>
    );
  }
});

export default App;