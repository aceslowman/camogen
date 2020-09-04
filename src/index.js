import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import MainStore from './MainStore';
import RootStore from './RootStore';
import makeInspectable from 'mobx-devtools-mst';
import 'mobx-react-lite/batchingForReactDom'
import { Scene } from './stores/SceneStore';
import { ShaderGraph } from './stores/ShaderGraphStore';
import { getSnapshot } from 'mobx-state-tree';

const root = RootStore.create({});

console.dir(getSnapshot(root))

makeInspectable(root);

// ReactDOM.render(<App store={new MainStore()}/>, document.getElementById('root'));
ReactDOM.render(<App store={root}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
