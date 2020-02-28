import { observable, action, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
import * as NODES from './components/nodes';
import ShaderData from './stores/ShaderData';
import PageData from './stores/PageData';

class ObservableStore {
  consoleText = 'camogen';
  suggestText = '';
  helpText = '';

  page = new PageData();

  targets = [{
    id: uuidv1(),
    active: true,
    shaders: [
      new ShaderData("UV"),
      new ShaderData("Glyph"),
      new ShaderData("Glyph"),
      new ShaderData("Threshold"),
    ],
  },
  {
    id: uuidv1(),
    active: false,
    shaders: [
      new ShaderData("Noise"),
    ],
  }
  ];

  activeTarget = "";
  activeParameter = "";

  addShader(target, type, index = null) {    
    let i = index ? index : target.shaders.length;
    target.shaders.splice(i, 0, new ShaderData(type));
  }

  removeShader(shader,target) {
    target.shaders = target.shaders.filter((item) => item !== shader);
  }

  consoleChanged() {
    switch (this.consoleText) {
      case 'clear':
        this.clearAllNodes();
        this.consoleText = "";
        this.consoleStyle = {color:'black'};
        break;
      default:
        this.addNode(this.consoleText);
        this.consoleText = "";
        this.suggestText = "";
        break;
    }
  }

  suggest(text) {
    const regex = new RegExp("^"+text+".*","g");
    const matched = NODES.types.filter((t) => 
      t.match(regex)
    );

    this.suggestText = matched.length && text ? matched[0] : '';
  }
}

decorate(ObservableStore, {  
  consoleText: observable,
  helpText: observable,
  suggestText: observable,

  activeParameter: observable,

  targets: observable,
  activeTarget: observable,

  addShader: action,
  removeShader: action,

  consoleChanged: action,
  suggest: action,

  page: observable,
});

const observableStore = new ObservableStore();

export default observableStore;