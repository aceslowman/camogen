import { observer } from 'mobx-react';
import React from 'react';
import { ControlGroupComponent, InputSelect } from 'maco-ui';

const ImageInputComponent = observer((props) => {
	return (
        <React.Fragment>
            <ControlGroupComponent name="Image File">
                {/* <InputSelect
                    options={
                        props.input_options.map((e)=>({
                            label: e.label, 
                            value: e.deviceId
                        }))
                    }
                    onChange={props.onInputSelect}
                />				 */}
            </ControlGroupComponent>	
        </React.Fragment>        
	)
});

export default ImageInputComponent;