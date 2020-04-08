import React from 'react';
import { observer } from 'mobx-react';
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
import * as ParameterGraph from './ParameterGraph';
import MainContext from '../MainContext';

import InputBool from './input/InputBool';
import InputFloat from './input/InputFloat';

class ParameterStore {
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
    }
  }
}

decorate(ParameterStore, {
  uuid: observable,
  name: observable,
  value: observable,
  graph: observable,
});

createModelSchema(ParameterStore, {
  uuid: identifier(),
  name: primitive(),
  value: primitive(),
  graph: object(ParameterGraph),
});

class ParameterComponent extends React.Component {

    static contextType = MainContext;

    handleChange = e => this.props.data.value = e;

    handleClick = () => {
        const { data, index, isArray } = this.props;
        this.context.store.activeParameter = data;
        this.context.store.activeParameterIndex = isArray ? index : null;        
    }

    componentDidMount() {
        const { index, data } = this.props;
        this.value = this.props.isArray ? data.value[index] : data.value;

        switch (this.value.constructor) {
            case Boolean:
                this.input = (<InputBool
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
            case Number:
                this.input = ( < InputFloat
                    step={0.1}
                    value={this.value}
                    // name={"none"}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
            default:
                this.input = ( < InputFloat
                    step={0.1}
                    value={this.value}
                    // name={"none"}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
        }
    }

    render() {
        const { data, isArray, name } = this.props;

        return (
            <div className="parameter_wrapper">
                <fieldset>            
                    <legend className="invert">{isArray ? name : data.name}</legend>                    
                    {this.input}                                                         
                </fieldset>
            </div>
        )
    }
};

const store = ParameterStore;
const component = observer(ParameterComponent);

export {
  store,
  component
}
