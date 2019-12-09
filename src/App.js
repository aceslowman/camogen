import React from 'react';
import { observer } from 'mobx-react';

import './App.css';

import HelpText from './components/HelpText';
import ConsoleBar from './components/ConsoleBar';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './components/sketch';

import InputGroup from './components/InputGroup';

// import shaders for gui elements
import DebugShader from './components/shaders/DebugShader'; 
import GlyphShader from './components/shaders/GlyphShader'; 

const App = observer(class App extends React.Component {

  generateLayers(store){
    this.nodes = [];
    this.store = store;

    for(let i = 0; i < store.nodes.allIds.length; i++) {
      let id = this.store.nodes.allIds[i];
      let node = this.store.nodes.byId[id];

      switch(node.type) {
        case 'GlyphShader':
          this.nodes.push(<GlyphShader key={id} store={store} node_id={id}/>);        
          break;
        case 'DebugShader':
          this.nodes.push(<DebugShader key={id} store={store} node_id={id}/>);
          break;
        default:
          break;
      }
    }
  }

  handleResize() {
    this.store.canvasWidth = this.canvas.wrapper.clientWidth;
    this.store.canvasHeight = this.canvas.wrapper.clientHeight;
  }

  componentDidMount() {
    const store = this.props.store;

    this.store.canvasWidth = this.canvas.wrapper.clientWidth;
    this.store.canvasHeight = this.canvas.wrapper.clientHeight;

    this.store.sketchReady = true;

    window.addEventListener('resize',() => this.handleResize());
  }

  render() {
    this.store = this.props.store;
    this.generateLayers(this.store);

    return (
      <div id="flexcontainer">
        <div id="textcontainer">            
          <HelpText store={this.store} />  
          <div id="textcontainer_inner">
            {this.nodes}
          </div>  
          <ConsoleBar store={this.store} />
        </div>
        <P5Wrapper 
          store={this.store}
          ref={(r) => {this.canvas = r}}
          sketch={sketch}      
        />
      </div>
    );
  }
});

export default App;