import React from 'react';

const style = {
    width: '50px',
}

export default class InputFloat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.val
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.val !== this.props.val) {
            console.log('something changed')
            this.setState({
                value: this.props.val
            })
        }
    }

    updateValue(e) {
        this.setState( {
            value: e.target.value
        });

        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <fieldset style={{border:'1px dashed gray'}}>
                <legend>{this.props.name}</legend>
                <input 
                    style={{...this.props.style,...style}}
                    type="number" 
                    step={this.props.step}
                    placeholder={this.props.name}
                    value={this.state.value}
                    onChange={(e) => this.updateValue(e)}
                />
            </fieldset>
        );
    }
}