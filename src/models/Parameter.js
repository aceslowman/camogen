import { observable, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
import {
  createModelSchema,
  primitive,
  reference,
  list,
  object,
  identifier,
  serialize,
  deserialize
} from "serializr"
import ParameterGraph from './ParameterGraph';

export default class Parameter {
  uuid  = uuidv1();
  name  = "";
  value = null;
  graph = null;

  constructor (obj = null) {
    if(obj){
      this.name = obj.name;
      this.value = obj.value;
      this.graph = obj.graph;

      // associate with parent
      if (this.graph) this.graph.parent = this;
    } else {
      console.log('no object');
    }
  }
}

decorate(Parameter, {
  uuid: observable,
  name: observable,
  value: observable,
  graph: observable,
});

createModelSchema(Parameter, {
  uuid: identifier(),
  name: primitive(),
  value: primitive(),
  graph: object(ParameterGraph),
});