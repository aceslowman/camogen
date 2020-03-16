import React from 'react';

const style = {}

export default class InputFloat extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange = e => {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <input 
                style={{...this.props.style,...style}}
                type="number" 
                step={this.props.step}
                placeholder={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}