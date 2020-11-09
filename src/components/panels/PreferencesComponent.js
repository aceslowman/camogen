import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
    ControlGroupComponent,
    GenericPanel,
    InputColor,
    InputSelect,
    TextComponent,
    Themes
} from 'maco-ui';

const Preferences = (props) => {
    const store = useContext(MainContext).store;    

    return(
        <GenericPanel panel={props.panel}>
            <TextComponent>
                Hello World
            </TextComponent>
            <ControlGroupComponent name="theme">
                <InputSelect
                    options={[
                        {label: 'weyland', value: 'weyland'},
                        {label: 'yutani', value: 'yutani'},
                        {label: 'powershell', value: 'powershell'},
                        {label: 'sarah', value: 'sarah'},
                    ]}
                    onChange={(theme)=>{
                        store.setTheme(Themes[theme]);
                    }}
                />
            </ControlGroupComponent>

            <ControlGroupComponent name="color">
                <InputColor 
                    // showValue
                    label="primary"
                    value={store.theme.primary_color}
                    onChange={(value)=>{
                        store.setTheme({
                            ...store.theme, 
                            primary_color: value
                        })
                    }}
                />
                <InputColor
                    // showValue
                    label="secondary"
                    value={store.theme.secondary_color}
                    onChange={(value)=>{
                        store.setTheme({
                            ...store.theme,
                            secondary_color: value
                        })
                    }}
                />
                <InputColor 
                    // showValue
                    label="text"
                    value={store.theme.text_color}
                    onChange={(value)=>{
                        store.setTheme({
                            ...store.theme,
                            primary_color: value
                        })
                    }}
                />
                <InputColor 
                    // showValue
                    label="accent"
                    value={store.theme.accent_color}
                    onChange={(value)=>{
                        store.setTheme({
                            ...store.theme,
                            accent_color: value
                        })
                    }}
                />
            </ControlGroupComponent>					
        </GenericPanel>	
    )
}

export default Preferences;