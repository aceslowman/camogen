import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import InputBool from '../components/input/InputBool';
import InputFloat from '../components/input/InputFloat';

let style = {
    wrapper: {
        display: 'inline-block',
    },
    fieldset: {
        padding: '2px',
        marginTop: '10px',
        display: 'inline-block',
    },
    input: {
        boxSizing: 'border-box',
        width: '100%',
    }, 
    legend: {
        padding: '2px 4px', 
    } 
}

const Parameter = observer(class Parameter extends React.Component {

    static contextType = MainContext;

    handleChange = e => {  
        if(this.props.isArray) {
            this.props.data.value[this.props.index] = e;
        } else {
            this.props.data.value = e;         
        }
    };

    handleClick = e => {
        const { data, index, isArray } = this.props;
        this.context.store.activeParameter = data;
        this.context.store.activeParameterIndex = isArray ? index : null;
    }

    render() {
        const { data, index, isArray, name } = this.props;

        this.value = this.props.isArray ? data.value[index] : data.value;

        let input;

        switch (this.value.constructor) {
            case Array: 
                input = "";
                // input = (InputArray
                //     style={style.input}
                //     type="number"
                //     step={0.1}
                //     value={this.value}
                //     onChange={this.handleChange}
                //     onClick={this.handleClick}
                // />);
            break;
            case Boolean:
                input = (<InputBool
                    style={style.input}
                    step={0.1}
                    value={this.value}
                    // name={"none"}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
            case Number:
                input = (<InputFloat
                    style={style.input}
                    step={0.1}
                    value={this.value}
                    // name={"none"}
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                />);
            break;
            default:
                input = (<input
                    style={style.input}
                    type="number"
                    step={0.1}
                    value={this.value}
                    // name={"none"}
                    onChange={e=>this.handleChange(e.target.value)}
                    onClick={this.handleClick}
                />);
            break;
        }

        return (
            <div style={style.wrapper}>
                <fieldset style={style.fieldset}>            
                    <legend className="invert" style={style.legend}>{isArray ? name : data.name}</legend>                    
                        {input}                                                         
                </fieldset>
            </div>
        )
    }
});

export default Parameter;
