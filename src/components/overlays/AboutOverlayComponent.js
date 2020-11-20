import React, { useContext, useState } from 'react';
import {
    InputSelect,
    ThemeContext,
    PanelComponent
} from 'maco-ui';
import styles from './AboutOverlayComponent.module.css';
import MainContext from '../../MainContext';
import { observer } from 'mobx-react';

const AboutOverlay = observer(() => {
    const theme = useContext(ThemeContext);
    const store = useContext(MainContext).store;

    return(
        <PanelComponent 
            className={styles.wrapper}            
        >
            <h1>camogen <sub>v0.1.0</sub></h1>  
        
            <p>created by austin slominski</p>
            <small>@aceslowman</small>
        </PanelComponent>
    )
})

export default AboutOverlay;