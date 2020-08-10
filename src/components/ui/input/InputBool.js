import React from 'react';
import styles from './InputBool.module.css';

export default class InputBool extends React.PureComponent {

    updateValue = e => this.props.onChange(e.target.checked)

    render() {
        return (
            <input 
                style={this.props.style}
                type="checkbox"         
                value={this.props.value}
                onChange={this.updateValue}
            />
        );
    }
}