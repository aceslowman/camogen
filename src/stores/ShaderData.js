import { observable, computed, decorate } from 'mobx';
import uuidv1 from 'uuid/v1';
import * as NODES from '../components/nodes';

export default class ShaderData {
  id        = uuidv1();
  name      = "";
  uniforms  = [];
  precision = "";
  vert      = "";
  frag      = "";

  constructor(type) {
    this.load(NODES.modules[type]);
  }

  load = (obj) =>  {
    this.name = obj.name;
    this.uniforms = obj.uniforms;
    this.precision = obj.precision;
    this.vert = obj.vert;
    this.frag = obj.frag;
  }

  get vertex(){
    return this.precision + this.vert;  
  } 
  get fragment(){
    return this.precision + this.frag;  
  } 
}

decorate(ShaderData, {
  id: observable,
  target_id: observable,
  name: observable,
  uniforms: observable,
  precision: observable,
  vert: observable,
  frag: observable,
  vertex: computed,
  fragment: computed,
});