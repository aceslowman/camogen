import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import InputBool from './ui/input/InputBool';
import InputFloat from './ui/input/InputFloat';

import styles from './ParameterComponent.module.css';

const ParameterComponent = observer(class ParameterComponent extends React.Component {

    static contextType = MainContext;

    handleChange = e => {        
        this.props.data.value = e;
    }

    generateInputs() {
        const { data } = this.props;        
        this.value = data.value;

        switch (this.value.constructor) {
            case Boolean:
                this.input = (<InputBool
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                />);
            break;
            case Number:
                this.input = (<InputFloat
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                />);
            break;
            default:
                this.input = (<InputFloat
                    step={0.1}
                    value={this.value}
                    onChange={this.handleChange}
                />);
            break;
        }
    }

    handleDblClick = e => {
        if (this.props.onDblClick)
            this.props.onDblClick(this.props.data)
    }

    render() {
        const { data, active } = this.props;

        this.generateInputs();

        return (
            <div className={styles.parameter_wrapper}>
                <fieldset 
                    onDoubleClick={this.handleDblClick} 
                    style={{
                        border: active ? '2px dashed black' : '2px dashed white'
                    }}
                >    
                    <div>
                        {data.name && (
                            <legend className="invert">
                                {data.name}
                            </legend>
                        )}
                        {this.input}  
                    </div>                                                                    
                </fieldset>                
            </div>
        )
    }
});

export default ParameterComponent;
