import React from 'react';

const style = {
    width: '50px',
}

export default class InputBool extends React.Component {
    constructor(props) {
        super(props);
    }

    updateValue = e => {
        this.props.onChange(e.target.checked);
    }

    render() {
        return (
            <fieldset style={{border:'1px dashed gray'}}>
                <legend>{this.props.name}</legend>
                <input 
                    style={{...this.props.style,...style}}
                    type="checkbox"         
                    value={this.props.value}
                    onChange={this.updateValue}
                />
            </fieldset>
        );
    }
}