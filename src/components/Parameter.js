import React from 'react';

import { observer } from 'mobx-react';

const Parameter = observer(({style, data}) => (
    <fieldset>
        <legend>{data.name}</legend>
        <input 
            style={{...style}}
            type="number" 
            step={0.1}
            placeholder={data.name}
            value={data.value}
            onChange={(e) => data.value = e.target.value}
        />
    </fieldset>              
));

export default Parameter;
