import { observable, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
// import * as NODES from '../components/nodes';

export default class ParameterData {
  id = uuidv1();
  name = "";
  value = null;
  graph = [];

  constructor (obj) {
    this.name = obj.name;
    this.value = obj.value;
    // this.graph = obj.graph;
  }
}

decorate(ParameterData, {
  id: observable,
  name: observable,
  value: observable,
  graph: observable,
});