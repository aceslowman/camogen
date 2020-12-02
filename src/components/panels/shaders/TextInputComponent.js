import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const TextInputComponent = observer((props) => {
  console.log('HIT',props) 
  
  const handleTextChange = (e) => {
    console.log(e)
  }
  
	return (
    <ControlGroupComponent name="Text">
        <input type="textarea" onChange={handleTextChange} />
    </ControlGroupComponent>	
	)
});

export default TextInputComponent;