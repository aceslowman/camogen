import React from 'react';
import { MainProvider } from './MainContext';
import { observer } from 'mobx-react';
import './App.css';

import ConsoleBar from './components/ui/ConsoleBar';
import ToolBar from './components/ui/ToolBar';
import { component as ParameterGraph} from './components/ParameterGraph';
import { component as Target } from './components/Target';
import { component as Shader} from './components/Shader';
import Splash from './components/Splash';

const App = observer(class App extends React.Component {

  constructor() {
    super();
    this.targets = [];
    this.workAreaRef = React.createRef();

    this.state = {      
      updateFlag: false,
    }
  }

  handleResize = () => {
    this.store.p5_instance.resizeCanvas(
      this.props.work_area.current.offsetWidth,
      this.props.work_area.current.offsetHeight
    );

    // update target dimensions
    for (let target_data of this.store.targets) {
      let target = target_data.ref;

      target.resizeCanvas(
        this.props.work_area.current.offsetWidth,
        this.props.work_area.current.offsetHeight
      );
    }

    this.store.p5_instance.draw();
  }

  componentDidMount() {   
    this.generateTargets(); 
    window.addEventListener('resize', this.handleResize);
  }

  generateTargets(){
    this.targets = [];
    console.log(this.store.targets)

    for(let target_node of this.store.targets) {
      let nodes = [];

      for(let shader_node of target_node.shaders) {
        console.log(shader_node.name, shader_node);
        nodes.push((
          <Shader 
            key={shader_node.uuid} 
            data={shader_node} 
          />
        ));
      }

      this.targets.push((
        <Target key={target_node.uuid} data={target_node}>
          {nodes}
        </Target>
      ));
    }

    // force a single re-render
    this.setState((prevState)=>({updateFlag: !prevState.updateFlag}));
  }  

  render() {
    this.store = this.props.store;

    return (    
      <MainProvider value={{store: this.store}}>
        <div id="mainWrapper">          
          <ToolBar />

          <div className="work_area">           

            <div className="work_area_inner" ref={this.workAreaRef}>
              <div className="target_group">
                {this.targets}
              </div>
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