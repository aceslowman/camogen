import React from 'react';

export default class InputBool extends React.Component {

    updateValue = e => this.props.onChange(e.target.checked)

    render() {
        return (
            <fieldset style={{border:'1px dashed gray'}}>
                <legend>{this.props.name}</legend>
                <input 
                    style={this.props.style}
                    type="checkbox"         
                    value={this.props.value}
                    onChange={this.updateValue}
                />
            </fieldset>
        );
    }
}