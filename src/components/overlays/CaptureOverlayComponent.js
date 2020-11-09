import React, { useContext, useState } from 'react';
import {
    InputSelect,
    ThemeContext
} from 'maco-ui';
import styles from './CaptureOverlayComponent.module.css';
import MainContext from '../../MainContext';
import { observer } from 'mobx-react';

const CaptureOverlay = observer(() => {
    const theme = useContext(ThemeContext);
    const store = useContext(MainContext).store;
    const [format, setFormat] = useState('PNG');

    const handlePlay = e => {
        console.log('Play')
        store.transport.play();
    }

    const handleStop = e => {
        console.log('Stop')
        store.transport.stop();
    }

    const handleRecord = e => {
        console.log('Record')
        store.transport.record();
    }
    
    const handleSkipToStart = () => {
        store.transport.skipToStart();
    }

    const handleSnap = e => {
        console.log('Snap')
        store.snapshot(format);
    }

    const handleFormatSelect = e => {
        console.log('FormatSelect',e)
        setFormat(e);
    }

    return(
        <div 
            className={styles.wrapper}            
        >
            <div 
                className={styles.options}
                style={{
                    backgroundColor: theme.primary_color,
                    color: theme.text_color,
                    borderColor: theme.outline_color
                }}
            >
                <button 
                    title="play" 
                    onClick={handlePlay}
                    style={{
                        color: store.transport.playing ? theme.accent_color : theme.text_color
                    }}
                > ▶ </button>
                <button 
                    title="stop" 
                    onClick={handleStop}
                    style={{
                        color: !store.transport.playing ? theme.accent_color : theme.text_color
                    }}
                > ■ </button>
                <button 
                    title="to start" 
                    onClick={handleSkipToStart}
                > ⭰ </button>
                {/* <button onClick={handleSkipToStart}> ⭲ </button> */}
                <button 
                    title="record" 
                    onClick={handleRecord}
                    style={{
                        color: store.transport.recording ? 'red' : theme.text_color
                    }}
                > ● </button>
                <button 
                    title="snapshot" 
                    onClick={handleSnap}
                > snap </button>

                <div className={styles.spacer}></div>

                <div className={styles.clock}>
                    <small>frameclock: {store.transport.frameclock}</small>
                </div>
                
                <div className={styles.spacer}></div>
                	
                <InputSelect
                    label="format"
                    options={[
                        {label: '.png', value: 'PNG'},   
                        {label: '.jpeg', value: 'JPEG'},                        
                    ]}
                    onChange={handleFormatSelect}
                />

            </div>            
        </div>
    )
})

export default CaptureOverlay;