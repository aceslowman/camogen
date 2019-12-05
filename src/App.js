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
  constructor(props) {
    super(props);
  }

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

  handleGenerate() {
    this.setState(prevState  =>  ({generateFlag: !prevState.generateFlag}))
  }

  handleLevelUp() {
    let next = Object.keys(this.state.levels).length;

    this.setState(prevState => ({
      levels: {
        ...prevState.levels,
        [next]: {
          seed: Math.floor(Math.random() * 1000),
          noiseScale: Math.random() * 2,
          noiseStep: 8,
          dimX: 2,
          dimY: 2,
        }
      }
    }))
  }

  handleLevelDown() {
    let last = Object.keys(this.state.levels).length - 1;

    let newState = this.state;
    delete newState.levels[last];
    this.setState(newState)
  }

  handleRandomize() {
    for(let i=0;i<2;i++) {
      let dim = Math.floor(Math.random() * (60 / (i + 1)));

      this.setState(prevState => ({
        levels: {
          ...prevState.levels,
          [i]: {
            ...prevState.levels[i],
            seed: Math.floor(Math.random() * 1000),
            noiseScale: Math.random() * 2,
            noiseStep: 8,
            dimX: dim,
            dimY: dim,
          }
        }
      }))
    }

    this.handleGenerate();
  }

  handleSnapshot() {
    this.setState(prevState  =>  ({snapshotFlag: !prevState.snapshotFlag}))
  }

  updateParameter(i,k,v){
    this.setState(prevState => ({
      levels: {
        ...prevState.levels,
        [i]: {
          ...prevState.levels[i],
          [k]: v
        }
      }
    }));

    // this.handleGenerate();
  }

  handleResize(e) {
    this.setState( {
      width: e.target.value,
      height: e.target.value
    });
  }

  handleFitScreen() {
    let c = document.getElementById('defaultCanvas0').parentNode;
    console.log(c.offsetHeight);

    if(c.offsetHeight > c.offsetWidth) {
      this.setState({
        width: c.offsetHeight,
        height: c.offsetHeight
      });
    }else {
      this.setState({
        width: c.offsetWidth,
        height: c.offsetWidth
      });
    }
  }

  handleAddNode(type) {
    switch(type) {
      case 'glyph':
        this.nodes.push(<GlyphShader key={this.nodes.length}/>);        
        break;
      case 'debug':
        this.nodes.push(<DebugShader key={this.nodes.length}/>);
        break;
      default:
        break;
    }
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
              <button onClick={() => this.handleGenerate()}>generate</button>
              <button onClick={() => this.handleRandomize()}>randomize</button>
              <button onClick={() => this.handleSnapshot()}>snapshot</button>
              <button onClick={() => this.handleLevelDown()}>lvl -</button>
              <button onClick={() => this.handleLevelUp()}>lvl +</button>
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