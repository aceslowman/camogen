import React, { useState, useContext, useRef } from 'react';
import MainContext from '../../MainContext';
import styles from './ShaderEditorComponent.module.css';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";

import {
    PanelComponent,
    ToolbarComponent,
} from 'maco-ui';

import useResizeObserver from '../hooks/ResizeHook';

const ShaderEditor = (props) => {
    const store = useContext(MainContext).store;
    const mainRef = useRef(null);
    const [editType, setEditType] = useState('vert');
    const [editorSize, setEditorSize] = useState({width: 0, height: 0});
    
    useResizeObserver(()=>{
        let bounds = mainRef.current.getBoundingClientRect();
        setEditorSize({width: bounds.width, height: bounds.height})
        // console.log(editorSize)
    }, mainRef);

    const handleRefresh = () => {
        store.p5_instance.loop();
        props.data.init()
    }

    const handleEditorChange = e => {
        switch (editType) {
            case 'vert':
                props.data.setVert(e);
                break;
            case 'frag':
                props.data.setFrag(e);
                break;    
            default:
                break;
        }
    }

    const showEditor = props.node !== undefined && props.data;
    
    return(
        <PanelComponent
            detachable
            onRemove={()=>store.workspace.removePanel('Shader Editor')}
            title="Shader Editor"	
            subtitle={(
                <span style={{
                    fontStyle: props.hasChanged ? 'italic' : 'normal'
                }}>
                    {props.hasChanged ? 'unsaved' : ''}
                </span>
            )}		
            style={{minWidth:400,flexGrow:2,flexShrink:0}}
            defaultSize={props.defaultSize}
            onRef={mainRef}
            toolbar={(
                <ToolbarComponent  
                    items={ showEditor ? [
                        {
                            label: 'Save Shader',
                            onClick: () => props.data.save()
                        },
                        {
                            label: 'Vertex',
                            onClick: () => setEditType('vert'),
                            highlight: editType === 'vert',
                        },
                        {
                            label: 'Fragment',
                            onClick: () => setEditType('frag'),
                            highlight: editType === 'frag',
                        }, 
                        {
                            label: 'Refresh',
                            onClick: () => handleRefresh()
                        },
                    ] : [
                        {
                            label: 'New Shader',
                            onClick: () => props.graph.setSelectedByName('Default')
                        },
                        {
                            label: 'Load Shader',
                            onClick: () => {
                                props.data.load()
                            }
                        }, 
                    ]}
                /> 
            )}
        >		
                
            {
                showEditor && (<AceEditor
                    mode="glsl"
                    theme="monokai"
                    onChange={handleEditorChange}
                    value={editType === 'frag' ? props.data.frag : props.data.vert}
                    // height={editorSize.height+'px'}
                    // width={editorSize.width+'px'}
                    minHeight="0px"
                    className={styles.ace_editor}
                    // showGutter={false}		 												
                />)
            }

            {
                !showEditor && (
                    <p className={styles.no_node_selected}>
                        <em> no shader node selected</em><br/><br/>
                    </p>
                )
            }
        </PanelComponent>
    )
}

export default ShaderEditor;