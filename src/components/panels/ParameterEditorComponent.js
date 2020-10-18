import React, {useContext} from 'react';
import MainContext from '../../MainContext';
import OperatorGraph from "./OperatorGraphComponent";
import styles from './ParameterEditorComponent.module.css';

import {
    PanelComponent,
    SplitContainer,
    ToolbarComponent
} from 'maco-ui';
import { observer } from 'mobx-react';
import OperatorControls from './OperatorControlsComponent';


const OperatorEditor = observer((props) => {
    const store = useContext(MainContext).store;

    const handleRemove = () => store.workspace.removePanel('Parameter Editor');

    return(
        <PanelComponent 
            detachable
            onDetach={props.onDetach ? props.onDetach : () => {}}
            onRemove={handleRemove}
            title="Parameter Editor"	
            defaultSize={props.defaultSize}
            toolbar={props.data && (
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
            )}
        >		
            
                {
                    props.data && (
                        <SplitContainer vertical>
                            <OperatorGraph 
                                data = {props.data}
                                selectedNode = {props.data.graph.selectedNode}
                                coord_bounds = {props.coord_bounds}
                            />
                            <OperatorControls 
                                data = {props.data.graph}

                            />                      
                        </SplitContainer>                        
                    )
                }

                {
                    !props.data && (
                        <p className={styles.no_node_selected}>
                            <em> no param selected</em>
                        </p>
                    )
                }

        </PanelComponent>
    )
	
});

export default OperatorEditor;