import React from 'react';
import {
    GenericPanel,
    TextComponent,
    ToolbarComponent,
} from 'maco-ui';

import styles from './MessagesComponent.module.css';
import { observer } from 'mobx-react';

const Messages = observer((props) => {

    const toolbar = (
        <ToolbarComponent 
            items={[
                {
                    label: 'clear',
                    onClick: () => props.data.clear()
                }
            ]}
        />
    )

    return(
        <GenericPanel
            panel={props.panel}
            toolbar={toolbar}
        >
            <TextComponent>
                <ul className={styles.loglist}>
                    {props.log.slice().reverse().map( (e,i) => {
                        return (
                            <li key={i} className={styles[e.type]}>
                                <span className={styles.timestamp}>{`${e.timestamp.toLocaleString()}: `}</span><br />
                                {`${e.message}`}
                            </li>
                        )
                    })}
                </ul>     
            </TextComponent>					
        </GenericPanel>		
    )
});

export default Messages;