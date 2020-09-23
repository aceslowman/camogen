import React, {useContext} from 'react';
import MainContext from '../../MainContext';
import ParameterGraph from "./ParameterGraphComponent";
import styles from './ParameterEditorComponent.module.css';

import {
    PanelComponent,
    SplitContainer,
    ToolbarComponent,
} from 'maco-ui';
import { observer } from 'mobx-react';
import CounterComponent from './operators/CounterComponent';

const ParameterEditor = observer((props) => {
    const store = useContext(MainContext).store;

    const handleRemove = () => store.workspace.removePanel('Parameter Editor');

    const generateParameterControls = () => {
        let controls = [];
        
        Array.from(props.data.graph.nodes.values()).forEach((e,i) => {	
            if(e.data) {
                let c;

                switch (e.data.name) {
                    case "Counter":
                        c = (			
                            <CounterComponent 
                                modifier={e.data.modifier}
                                value={e.data.value}
                                handleChange={e.data.handleChange} 
                            />
                        )
                        break;
                
                    default:
                        break;
                }

                controls.push(
                    <PanelComponent 
                        key={e.uuid}
                        title={e.data.name}			
                        onRemove={e.data.onRemove}
                        collapsible
                        gutters
                    >		
                        {c}
                    </PanelComponent>
                )
            }
        });

        return controls;
    }

    // useEffect(() => {
    //     if(props.data)
    //         // generateParameterControls();
    // }, [props.data])

    return(
        <PanelComponent 
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
            
            {/* <div className={styles.content}>                                       */}
                {
                    props.data && (
                        <SplitContainer vertical>
                            <ParameterGraph 
                                data = {props.data}
                            />
                            <PanelComponent>
                                { generateParameterControls() }
                            </PanelComponent>                            
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
            {/* </div>                 */}

        </PanelComponent>
    )
	
});

export default ParameterEditor;