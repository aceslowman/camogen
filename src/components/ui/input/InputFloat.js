import React from 'react';

export default class InputFloat extends React.Component {

    handleChange = e => this.props.onChange(e.target.value);    

    render() {
        return (
            <input 
                style={this.props.style}
                type="number" 
                step={this.props.step}
                placeholder={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
                onClick={this.props.onClick}
            />
        );
    }
}