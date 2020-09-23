import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import {
    PanelComponent,
    TextComponent,
    ToolbarComponent,
} from 'maco-ui';

import styles from './MessagesComponent.module.css';
import { observer } from 'mobx-react';

const Messages = observer((props) => {
    const store = useContext(MainContext).store;
    const handleRemove = () => store.workspace.removePanel('Messages')

    return(
        <PanelComponent
            title="Messages" 
            onRemove={handleRemove}
            vertical
            toolbar={(
                <ToolbarComponent 
                    items={[
                        {
                            label: 'clear',
                            onClick: () => props.data.clear()
                        }
                    ]}
                />
            )}
        >
            <TextComponent>
                <ul className={styles.loglist}>
                    {props.log.reverse().map( (e,i) => {
                        return (
                            <li key={i} className={styles[e.type]}>
                                <span className={styles.timestamp}>{`${e.timestamp.toLocaleString()}: `}</span><br />
                                {`${e.message}`}
                            </li>
                        )
                    })}
                </ul>     
            </TextComponent>					
        </PanelComponent>		
    )
});

export default Messages;