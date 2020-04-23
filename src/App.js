import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ConsoleBar';
import ToolBar from './components/ToolBar';
import ParameterGraph from './components/ParameterGraphComponent';
import Target from './components/TargetComponent';
import Splash from './components/Splash';

const App = observer(class App extends React.Component {

  constructor() {
    super();
    this.targets = [];
    this.workAreaRef = React.createRef();
  }

  handleResize = () => {
    this.store.p5_instance.resizeCanvas(
      this.workAreaRef.current.offsetWidth,
      this.workAreaRef.current.offsetHeight
    );

    // update target dimensions
    for (let target_data of this.store.targets) {
      let target = target_data.ref;

      target.resizeCanvas(
        this.workAreaRef.current.offsetWidth,
        this.workAreaRef.current.offsetHeight
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
          <ToolBar />

          <div id="WORKAREA">           

            <div id="WORKAREA_inner" ref={this.workAreaRef}>

              {this.store.targets.map((target)=>{
                return (
                  <Target 
                    key={target.uuid} 
                    data={target}
                  />
                );
              })}

              { this.store.activeParameter &&
                <ParameterGraph data={this.store.activeParameter}/>
              }
              
              { this.store.show_splash && <Splash /> }

            </div>          

            <ConsoleBar />
          </div>
        </div>
      </MainProvider>
    );
  }
});

export default App;