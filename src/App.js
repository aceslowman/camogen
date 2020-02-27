import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';
import HelpText from './components/ui/HelpText';
import ConsoleBar from './components/ui/ConsoleBar';
import ParameterDisplay from './components/ParameterDisplay';
import GraphicsRunner from './components/GraphicsRunner';
import Target from './components/Target';
import Shader from './components/Shader';
import SVGLayer from './SVGLayer';
import PageLayout from './components/PageLayout';

const style = {
  wrapper: {
    height: "100%",
    boxSizing: "border-box",
  },

  panel: {
    margin : "0",
    padding: "0",
    boxSizing: "border-box",
    width: "50%",
    height : "100%",
  },

  gui_panel: {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    flexFlow: "column",    
  },

  gui_panel_inner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    overflowY: "hidden",
  }
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

    let ctx = {
      store: this.store,
      p5_instance: this.instance,
    }

    return (    
      <MainProvider value={ctx}>
        <div id="mainWrapper" style={style.wrapper}>          
          <GraphicsRunner />
          <div style={style.gui_panel}>           
            <HelpText />  
            <div style={style.gui_panel_inner}>
              <div>
                {this.targets}
              </div>
              { this.store.activeParameter &&
                <ParameterDisplay data={this.store.activeParameter}/>
              }
              <PageLayout />
            </div>  
            <ConsoleBar />
            
              {/*<SVGLayer />*/}

          </div>
        </div>
      </MainProvider>
    );
  }
});

export default App;