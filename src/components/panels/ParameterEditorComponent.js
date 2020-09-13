import React, {useContext} from 'react';
import MainContext from '../../MainContext';
import ParameterGraph from "./ParameterGraphComponent";
import styles from './ParameterEditorComponent.module.css';

import {
    PanelComponent,
    ToolbarComponent,
} from 'maco-ui';

const ParameterEditor = (props) => {
    const store = useContext(MainContext).store;

    const handleRemove = () => store.workspace.removePanel('Parameter Editor')

    return(
        <PanelComponent 
            collapsed={props.collapsed}
            onRemove={handleRemove}
            title="Parameter Editor"			
            className={styles.editor}
            defaultSize={props.defaultSize}
            style={{
                minWidth:400,
                flexGrow:2,
                flexShrink:0
            }}
        >		
            <ToolbarComponent  
                items={[
                    {
                        label: 'Inputs',
                        dropDown: [
                            {
                                label: 'MIDI',
                                onClick: () => props.data.graph.setSelectedByName('MIDI')
                            },
                            {
                                label: 'Counter',
                                onClick: () => props.data.graph.setSelectedByName('Counter')
                            },
                        ]
                    },
                    {
                        label: 'Operators',
                        dropDown: [
                            {
                                label: 'Add',
                                onClick: () => props.data.graph.setSelectedByName('Add')
                            }, 
                            {
                                label: 'Subtract',
                                onClick: () => props.data.graph.setSelectedByName('Subtract')
                            },
                            {
                                label: 'Divide',
                                onClick: () => props.data.graph.setSelectedByName('Divide')
                            },
                            {
                                label: 'Multiply',
                                onClick: () => props.data.graph.setSelectedByName('Multiply')
                            },
                            {
                                label: 'Modulus',
                                onClick: () => props.data.graph.setSelectedByName('Modulus')
                            },
                        ]
                    },
                    {
                        label: 'Trig',
                        dropDown: [{
                                label: 'Sine',
                                onClick: () => props.data.graph.setSelectedByName('Sin')
                            },
                            {
                                label: 'Cosine',
                                onClick: () => props.data.graph.setSelectedByName('Cos')
                            },
                            {
                                label: 'Tangent',
                                onClick: () => props.data.graph.setSelectedByName('Tan')
                            },
                        ]
                    },
                ]}
            />   

            <div className={styles.content}>                                      
                {
                    props.data && (<ParameterGraph data = {
                        props.data
                    }/>)
                }

                {
                    !props.data && (
                        <p className={styles.no_node_selected}>
                            <em> no node selected</em>
                        </p>
                    )
                }
            </div>                

        </PanelComponent>
    )
	
}

export default ParameterEditor;