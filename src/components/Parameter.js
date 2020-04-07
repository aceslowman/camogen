import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import InputBool from '../components/input/InputBool';
import InputFloat from '../components/input/InputFloat';

const Parameter = observer(class Parameter extends React.Component {

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
});

export default Parameter;
