import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const WebcamInputComponent = observer((props) => {
  console.log(props)
	return (
        <React.Fragment>
            <ControlGroupComponent name="Input Device">
                <InputSelect
                    options={
                        props.input_options.map((e)=>({
                            label: e.label, 
                            value: e.deviceId
                        }))
                    }
                    onChange={props.onInputSelect}
                />				
            </ControlGroupComponent>
            <ControlGroupComponent name="Display Mode">
                <InputSelect
                    options={[
                        {label: 'preserve aspect', value: 'preserve_aspect'},
                        {label: 'stretch', value: 'stretch'}
                    ]}
                    onChange={props.onChangeDisplayMode}
                />				
            </ControlGroupComponent>	
        </React.Fragment>        
	)
});

export default WebcamInputComponent;