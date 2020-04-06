import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import HelpText from './components/ui/HelpText';
import ConsoleBar from './components/ui/ConsoleBar';
import ToolBar from './components/ui/ToolBar';
import ParameterDisplay from './components/ParameterDisplay';
import GraphicsRunner from './components/GraphicsRunner';
import Target from './components/Target';
import Shader from './components/Shader';
import Splash from './components/Splash';

const App = observer(class App extends React.Component {

  constructor() {
    super();
    this.workAreaRef = React.createRef();
  }

  generateTargets(){
    this.targets = [];

    for(let target_node of this.store.targets) {
      let nodes = [];

      for(let shader_node of target_node.shaders) {
        console.log(shader_node);
        nodes.push((
          <Shader 
            key={shader_node.id} 
            data={shader_node} 
          />
        ));
      }

      this.targets.push((
        <Target key={target_node.id} data={target_node}>
          {nodes}
        </Target>
      ));
    }
  }  

  render() {
    this.store = this.props.store;
    this.generateTargets();    

    this.ctx = {
      ...this.ctx,
      store: this.store,
    }

    return (    
      <MainProvider value={this.ctx}>
        <div id="mainWrapper">          
          <GraphicsRunner 
            work_area={this.workAreaRef}
          />
          <ToolBar />

          <div className="work_area">           
            
            <HelpText />              
            <div className="work_area_inner" ref={this.workAreaRef}>
              <div className="target_group">
                {this.targets}
              </div>
              { this.store.activeParameter &&
                <ParameterDisplay data={this.store.activeParameter}/>
              }
              { this.store.show_splash &&
                <Splash />
              }
            </div>          

            <ConsoleBar />
          </div>
        </div>
      </MainProvider>
    );
  }
});

export default App;