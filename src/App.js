import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBarComponent';
// import ToolBar from './components/ToolBar';
import Graph from './components/graph/GraphComponent';
import Shelf from './components/shelf/ShelfComponent';
import Splash from './components/Splash';
import DebugInfo from './components/DebugInfo';
import PanelGroup from './components/ui/PanelGroupComponent';
import Editor from './components/ui/EditorComponent';

import Shader from './components/ShaderComponent';

const App = observer(class App extends React.Component {

  workAreaRef = React.createRef();

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

    // this.store.p5_instance.draw();
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
              { this.store.show_splash && <Splash /> }

                {this.store.shaderGraphs.map((graph,i)=>{
                  return (
                    <PanelGroup key={i}>
                      <DebugInfo collapsed />
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
                        collapsed 
                        key={i+'editor'}
                        data={this.store.currentlyEditing}
                      />                      
                    </PanelGroup>                    
                  );
                })}                            
            </div>          
            <ConsoleBar />
          </div>         
        </div>
      </MainProvider>
    );
  }
});

export default App;