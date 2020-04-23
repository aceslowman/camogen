import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import InputBool from './ui/input/InputBool';
import InputFloat from './ui/input/InputFloat';

const ParameterComponent = observer(class ParameterComponent extends React.Component {

    static contextType = MainContext;

    handleChange = e => {
        console.log(e, this.props.data);
        this.props.data.value = e;
    }

    handleClick = () => {
        const { data, index, isArray } = this.props;
        this.context.store.activeParameter = data;
        this.context.store.activeParameterIndex = isArray ? index : null;        
    }

    generateInputs() {
        const { index, data } = this.props;
        // this.value = this.props.isArray ? data.value[index] : data.value;
        this.value = data.value;
        // calling too many times
        // if (!this.value) console.log('HERE',data)
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
                this.input = ( <InputFloat
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
            default:
                this.input = ( <InputFloat
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
        }
    }

    render() {
        const { data, isArray, name } = this.props;

        this.generateInputs();

        return (
            <div className="parameter_wrapper">
                <fieldset>            
                    <legend className="invert">{isArray ? name : data.name}</legend>                    
                    {this.input}                                                         
                </fieldset>
            </div>
        )
    }
});

export default ParameterComponent;
