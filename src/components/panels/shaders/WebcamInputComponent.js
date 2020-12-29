import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const WebcamInputComponent = observer((props) => {
  const { data } = props.data;
  
  const handleInputSelect = e => data.setInput(e.target.value);
  const handleDisplayMode = e => data.setDisplayMode(e.target);
  
	return (
        <React.Fragment>
            <ControlGroupComponent name="Input Device">
                <InputSelect
                    options={
                        props.data.data.input_options.map((e)=>({
                            label: e.label, 
                            value: e.deviceId
                        }))
                    }
                    onChange={handleInputSelect}
                />				
            </ControlGroupComponent>
            <ControlGroupComponent name="Display Mode">
                <InputSelect
                    options={[
                        {label: 'preserve aspect', value: 'preserve_aspect'},
                        {label: 'stretch', value: 'stretch'}
                    ]}
                    onChange={handleDisplayMode}
                />				
            </ControlGroupComponent>	
        </React.Fragment>        
	)
});

export default WebcamInputComponent;