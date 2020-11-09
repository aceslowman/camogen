import React from 'react';
import {
    ControlGroupComponent,
    GenericPanel,
    TextComponent,
} from 'maco-ui';

const Capture = (props) => {
    return(
        <GenericPanel panel={props.panel}>
            <TextComponent>
                Hello World
            </TextComponent>
            <ControlGroupComponent name="Image Capture">
                {/* <InputSelect
                options={[
                    {label: 'weyland', value: 'weyland'},
                    {label: 'yutani', value: 'yutani'},
                    {label: 'powershell', value: 'powershell'},
                    {label: 'sarah', value: 'sarah'},
                ]}
                onChange={(theme)=>{
                    store.setTheme(Themes[theme]);
                }}
                /> */}
            </ControlGroupComponent>				
        </GenericPanel>		
    )
}

export default Capture;