import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBar';
import ToolBar from './components/ToolBar';
import Target from './components/TargetComponent';
import ShaderGraph from './components/ShaderGraphComponent';
import Splash from './components/Splash';

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
                {this.store.targets.map((target)=>{
                  return (
                    <Target 
                      key={target.uuid} 
                      data={target}
                    />
                  );
                })}  
                {this.store.shaderGraphs.map((graph)=>{
                  console.log('shader_graphs')
                  return (
                    <ShaderGraph
                      key={graph.uuid} 
                      data={graph}
                    />
                  );
                })}
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