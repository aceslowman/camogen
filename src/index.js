import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import MainStore from './MainStore';
// import RootStore, { undoManager } from './stores/RootStore';
import RootStore from './stores/RootStore'
import makeInspectable from 'mobx-devtools-mst';
import 'mobx-react-lite/batchingForReactDom'
// import { Scene } from './stores/SceneStore';
// import { ShaderGraph } from './stores/ShaderGraphStore';
// import { getSnapshot } from 'mobx-state-tree';






 
// import  defaultSnapshot from './snapshots/default.json';
// console.log(defaultSnapshot)
const root = RootStore.create({});

// root.applySnapshot(JSON.parse(defaultSnapshot));

makeInspectable(root);

ReactDOM.render(<App store={root} />, document.getElementById('root'));
// ReactDOM.render(<App store={root} history={undoManager}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
