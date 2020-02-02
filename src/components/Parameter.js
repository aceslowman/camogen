import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

let style = {
    wrapper: {
        width: '50%',
        display: 'inline-block',
        backgroundColor: 'white',
    },
    fieldset: {
        padding: '2px',
        display: 'inline-block',
    },
    input: {
        boxSizing: 'border-box',
        width: '100%',
    },  
}

const Parameter = observer(class Parameter extends React.Component {

    static contextType = MainContext;

    handleChange = e => {        
        if(this.props.isArray) {
            this.props.data.value[this.props.index] = e.target.value;
        } else {
            this.props.data.value = e.target.value;
        }
    };

    handleClick = e => {
        const { data, index, isArray } = this.props;
        this.context.store.activeParameter = data;
        this.context.store.activeParameterIndex = isArray ? index : null;
    }

    render() {
        const { data, index, isArray, name } = this.props;

        this.value = this.props.isArray ? data.value[index] : data.value;

        return (
            <div style={style.wrapper}>
                <fieldset style={style.fieldset}>            
                    <legend style={style.legend}>{isArray ? name : data.name}</legend>                    
                        <input 
                            style={style.input}
                            type="number" 
                            step={0.1}
                            value={this.value}
                            onChange={this.handleChange}
                            onClick={this.handleClick}
                        />                
                </fieldset>
            </div>
        )
    }
});

export default Parameter;
