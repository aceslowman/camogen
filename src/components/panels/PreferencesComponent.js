import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
    ControlGroupComponent,
    InputColor,
    InputSelect,
    PanelComponent,
    TextComponent,
    Themes
} from 'maco-ui';

const Preferences = (props) => {
    const store = useContext(MainContext).store;    

    const handleRemove = () => store.workspace.removePanel('Preferences')

    return(
        <PanelComponent
            title="Preferences" 
            onRemove={handleRemove}
            defaultSize={props.defaultSize}
            vertical
        >
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
        </PanelComponent>		
    )
}

export default Preferences;