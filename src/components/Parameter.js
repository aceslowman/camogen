import React from 'react';
import { observer } from 'mobx-react';

const Parameter = observer(class Parameter extends React.Component {

    handleClick = (e) => {        
        if(this.props.isArray) {
            this.props.data.value[this.props.index] = e.target.value;
        } else {
            this.props.data.value = e.target.value;
        }
    };

    render() {
        const { data, style, index } = this.props;

        this.value = this.props.isArray ? data.value[index] : data.value;

        return (
            <React.Fragment>
                <input 
                    style={{...style}}
                    type="number" 
                    step={0.1}
                    value={this.value}
                    onChange={this.handleClick}
                />
            </React.Fragment>
        )
    }
});

export default Parameter;
