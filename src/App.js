import React from 'react';
import { observer } from 'mobx-react';

import './App.css';

import HelpText from './components/HelpText';
import ConsoleBar from './components/ConsoleBar';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './components/sketch';

import RenderTarget from './components/nodes/RenderTarget';

import { MainProvider } from './MainContext';

const style = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    /* justifyContent: "space-between", */
    justifyContent: "center",
    alignItems: "center",
    alignContent: "stretch",
    height: "100%",
    boxSizing: "border-box",
    /* overflow: "hidden", */
    backgroundColor: "black",
  },

  panel: {
    margin : "0",
    padding: "0",
    boxSizing: "border-box",
    width: "50%",
    height : "100%",
  },

  gui_panel: {
    backgroundColor: "white",
    textAlign: "center",
    width: "50%",
    height: "100%",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexFlow: "column",
    /* alignContent: flex-start; */
    /*border: 6px dashed black;*/    
  },

  gui_panel_inner: {
    display: "flex",
    flexDirection: "column",
    // flexFlow: "wrap",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    overflowY: "hidden",
    /* background-color: red; */
    /* align-content: center; */
  }

}

const App = observer(class App extends React.Component {

  generateLayers(){
    this.nodes = [];

    for(let i = 0; i < this.store.shaders.allIds.length; i++) {
      let id = this.store.shaders.allIds[i];
      let node = this.store.shaders.byId[id];

      this.nodes.push(React.createElement(node.type, { key:id, node:node }));
    }
  }

  handleResize() {
    this.store.canvasWidth = this.canvas.wrapper.clientWidth;
    this.store.canvasHeight = this.canvas.wrapper.clientHeight;
  }

  componentDidMount() {
    this.store.canvasWidth = this.canvas.wrapper.clientWidth;
    this.store.canvasHeight = this.canvas.wrapper.clientHeight;

    this.store.sketchReady = true;

    window.addEventListener('resize',() => this.handleResize());
  }

  render() {
    this.store = this.props.store;
    this.generateLayers();    

    let ctx = {
      primary: 'blue',
      secondary: 'orange',
      store: this.store,
    }

    return (    
      <MainProvider value={ctx}>
        <div id="mainWrapper" style={style.wrapper}>
          <div style={style.gui_panel}>           
            <HelpText />  
            <div style={style.gui_panel_inner}>
              <RenderTarget target_id={0}>
                {this.nodes}
              </RenderTarget>
            </div>  
            <ConsoleBar />
          </div>
          <P5Wrapper     
            store={this.store}
            ref={(r) => {this.canvas = r}}
            sketch={sketch}      
          />
        </div>
      </MainProvider>
    );
  }
});

export default App;