import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import {
    InputBool,
    InputFloat,
    // InputSlider,
    // InputColor,
} from 'maco-ui';

// import styles from './ParameterComponent.module.css';

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
                    value={Number(this.value)}
                    onChange={this.handleChange}
                />);
            break;
            case Number:
                this.input = (<InputFloat
                    step={0.1}
                    value={Number(this.value)}
                    onChange={this.handleChange}
                />);
            break;
            default:
                this.input = (<InputFloat
                    step={0.1}
                    value={Number(this.value)}
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
        // const { data, active } = this.props;

        this.generateInputs();

        return (
            <div>
                {this.input}                
            </div>
        )
    }
});

export default ParameterComponent;
