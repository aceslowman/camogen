import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const ImageInputComponent = observer((props) => {
  const { data } = props.data;
  console.log('HIT',props) 
  
  const handleFileSubmit = (e) => {
    data.loadImage(e);
  }
  
	return (
    <ControlGroupComponent name="Image File">
        <input type="file" onChange={handleFileSubmit} />
    </ControlGroupComponent>	
	)
});

export default ImageInputComponent;