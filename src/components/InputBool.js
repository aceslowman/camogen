import React from 'react';

const style = {
    width: '50px',
}

export default class InputBool extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.val
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.val !== this.props.val) {
            
            this.setState({
                value: this.props.val
            })
        }
    }

    updateValue(e) {
        this.setState( {
            value: e.target.checked
        });

        this.props.onChange(e.target.checked);

        console.log(e.target.checked);
    }

    render() {
        return (
            <fieldset style={{border:'1px dashed gray'}}>
                <legend>{this.props.name}</legend>
                <input 
                    style={{...this.props.style,...style}}
                    type="checkbox"         
                    value={this.state.value}
                    onChange={(e) => this.updateValue(e)}
                />
            </fieldset>
        );
    }
}