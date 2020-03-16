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
import SVGLayer from './SVGLayer';
import PageLayout from './components/PageLayout';

const style = {
  wrapper: {
    height: "100%",
    width: '100%',
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row", 
  },

  work_area: {
    flexGrow: '1',
    // flexShrink: '0',
    // flexBasis: '50%',
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "flex-end",
    alignContent: "center",
    flexFlow: "column",    
  },

  work_area_inner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    overflowY: "hidden",
  },

  target_groups: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    height: window.innerHeight,
    alignItems: "center",
    alignContent: "flex-end",
    justifyContent: "center",
  },
}

const App = observer(class App extends React.Component {

  generateTargets(){
    this.targets = [];

    for(let target_node of this.store.targets) {
      let nodes = [];

      for(let shader_node of target_node.shaders) {
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
        <div id="mainWrapper" style={style.wrapper}>          
          <GraphicsRunner />

          <ToolBar />

          <div className="work_area" style={style.work_area}>           
            
            <HelpText />              
            <div className="work_area_inner" style={style.work_area_inner}>
              <div className="target_group" style={style.target_groups}>
                {this.targets}
              </div>
              {/* { this.store.activeParameter &&
                <ParameterDisplay data={this.store.activeParameter}/>
              } */}
              <PageLayout />
            </div>          

            <ConsoleBar />
          </div>
        </div>
      </MainProvider>
    );
  }
});

export default App;