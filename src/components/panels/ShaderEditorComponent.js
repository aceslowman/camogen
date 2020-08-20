import React, { useState, useContext } from 'react';
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

const ShaderEditor = (props) => {
    const store = useContext(MainContext).store;
    const [editType, setEditType] = useState('vert');

    const handleRefresh = () => {
        // restore the draw loop, if stopped
        store.p5_instance.loop();
        // re-initialize the data
        props.data.init()
    }

    const handleEditorChange = e => {
        props.data[editType] = e;
    }

    const handleFragEdit = () => {
        if (props.data) {
            setEditType('frag');
        }
    }

    const handleVertexEdit = () => {
        if (props.data) {
            setEditType('vert');
        }
    }

    return(
        <PanelComponent 
            collapsible
            onRemove={()=>store.removePanel('Shader Editor')}
            title="Shader Editor"	
            style={{minWidth:400,flexGrow:2,flexShrink:0}}
            toolbar={(
                <ToolbarComponent  
                    items={[
                        {
                            label: 'Save Shader',
                            onClick: () => props.data.save()
                        },
                        {
                            label: 'Edit Fragment',
                            onClick: () => handleFragEdit()
                        }, 
                        {
                            label: 'Edit Vertex',
                            onClick: () => handleVertexEdit()
                        },
                        {
                            label: 'Refresh',
                            onClick: () => handleRefresh()
                        },
                    ]}
                /> 
            )}
        >		
                
            {
                props.data && (<AceEditor
                    mode="glsl"
                    theme="monokai"
                    onChange={handleEditorChange}
                    value={props.data[editType]}
                    height=""
                    width=""
                    minHeight="500px"
                    className={styles.ace_editor}		 												
                />)
            }

            {
                !props.data && (
                    <p className={styles.no_node_selected}>
                        <em> no shader node selected</em>
                    </p>
                )
            }

            { props.data && props.data.node.graph.updateFlag ? '' : '' }
        </PanelComponent>
    )
}

export default ShaderEditor;