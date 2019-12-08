import React from 'react';
import { observer } from 'mobx-react';

import './App.css';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './components/sketch';

import InputGroup from './components/InputGroup';

// import shaders for gui elements
import DebugShader from './components/shaders/DebugShader'; 
import GlyphShader from './components/shaders/GlyphShader'; 

const App = observer(class App extends React.Component {

  generateLayers(store){
    this.nodes = [];

    for(let i = 0; i < store.nodes.allIds.length; i++) {
      let id = store.nodes.allIds[i];
      let node = store.nodes.byId[id];

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
    console.log('resize',[window.innerWidth,window.innerHeight]);
  }

  componentDidMount() {
    const store = this.props.store;

    store.canvasWidth = this.canvas.wrapper.clientWidth;
    store.canvasHeight = this.canvas.wrapper.clientHeight;

    store.sketchReady = true;
  }

  render() {
    const store = this.props.store;
    this.generateLayers(store);

    return (
      <div id="flexcontainer">
        <div id="textcontainer">
          <div id="textcontainer_top">
            <h1 style={{width: '100%'}}>camogen</h1><sub className="invert">v1.0</sub>
          </div>
          <div id="textcontainer_inner">
            {this.nodes}
          </div>  
          <div id="textcontainer_bottom">
            <div id="buttoncontainer">
              <button onClick={() => this.handleSnapshot()}>snapshot</button>
              <button onClick={() => store.addNode('glyph')}>add glyph</button>
              <button onClick={() => store.addNode('debug')}>add debug</button>
            </div>
            <InputGroup name="container dimensions">
              <button onClick={() => this.handleFitScreen()}>fit</button>
              <select onChange={(e) => this.handleResize(e)}>
                <option value={64}>64 x 64</option>
                <option value={128}>128 x 128</option>
                <option value={256}>256 x 256</option>
                <option value={512}>512 x 512</option>
                <option value={1024}>1024 x 1024</option>
                <option value={2048}>2048 x 2048</option>
                <option value={4096}>4096 x 4096</option>
              </select>
            </InputGroup>
          </div>
        </div>
        <P5Wrapper 
          store={store}
          ref={(r) => {this.canvas = r}}
          sketch={sketch}      
        />
      </div>
    );
  }
});

export default App;