import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect, InputFloat } from 'maco-ui';

const WebcamInputComponent = observer((props) => {
  const { data } = props.data;
  
  let pan = data.getUniform('pan');
  
  const handleInputSelect = e => data.setInput(e.target.value);
  const handleDisplayMode = e => data.setDisplayMode(e);
  const handlePan = (param,v) => param.setValue(v);
  
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
                        {label: 'fit vertical', value: 'fit_vertical'},
                        {label: 'fit horizontal', value: 'fit_horizontal'},
                        {label: 'stretch', value: 'stretch'}
                    ]}
                    onChange={handleDisplayMode}
                />				
            </ControlGroupComponent>
            <ControlGroupComponent name="Pan">
              {
                data.getUniform('pan').elements.map((e,i) => (
                  <InputFloat 
                    key={e.uuid}
                    value={e.value}
                    onChange={(v) => handlePan(e,v)}
                  />
                ))
              }
            </ControlGroupComponent>
        </React.Fragment>        
	)
});

export default WebcamInputComponent;