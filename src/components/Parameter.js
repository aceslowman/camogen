import React from 'react';

import { observer } from 'mobx-react';

const handleClick = (e) => data.value = e.target.value;

const Parameter = observer(({style, data}) => (
    <fieldset>
        <legend>{data.name}</legend>
        <input 
            style={{...style}}
            type="number" 
            step={0.1}
            placeholder={data.name}
            value={data.value}
            onChange={handleClick}
        />
    </fieldset>              
));

export default Parameter;
