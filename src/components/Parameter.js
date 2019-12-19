import React from 'react';

import { observer } from 'mobx-react';

import MainContext from '../MainContext';

const style = {};

const Parameter = observer(class Parameter extends React.Component {

    static contextType = MainContext;

    render() {
        const store = this.context.store;
        const data = this.props.data;

        return(
            <fieldset>
                <legend>{data.name}</legend>
                <input 
                    style={{...this.props.style,...style}}
                    type="number" 
                    step={0.1}
                    placeholder={data.name}
                    value={data.value}
                    onChange={(e) => data.value = e.target.value}
                />
            </fieldset>              
        )
    }
});

export default Parameter;