import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const ImageInputComponent = observer((props) => {
  console.log('HIT',props) 
  
  const handleFileSubmit = (e) => {
    console.log(e)
  }
  
	return (
    <ControlGroupComponent name="Image File">
        <input type="file" onChange={handleFileSubmit} />
    </ControlGroupComponent>	
	)
});

export default ImageInputComponent;