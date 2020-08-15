import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import ParameterGraph from "./ParameterGraphComponent";
import styles from './ParameterEditorComponent.module.css';

import {
    PanelComponent,
    ToolbarComponent,
} from 'maco-ui';

export default @observer class ParameterEditorComponent extends React.Component {
    static contextType = MainContext;  

	render() {	
        this.store = this.context.store;

		return(
            <PanelComponent 
                collapsed={this.props.collapsed}
                onRemove={()=>this.store.removePanel('Parameter Editor')}
				title="Parameter Editor"			
                className={styles.editor}
                style={{minWidth:400,flexGrow:2,flexShrink:0}}
			>		
                <ToolbarComponent  
                    items={[
                        {
                            label: 'Inputs',
                            dropDown: [
                                {
                                    label: 'MIDI',
                                    onClick: () => this.props.data.graph.setSelectedByName('MIDI')
                                },
                                {
                                    label: 'Counter',
                                    onClick: () => this.props.data.graph.setSelectedByName('Counter')
                                },
                            ]
                        },
                        {
                            label: 'Operators',
                            dropDown: [
                                {
                                    label: 'Add',
                                    onClick: () => this.props.data.graph.setSelectedByName('Add')
                                }, 
                                {
                                    label: 'Subtract',
                                    onClick: () => this.props.data.graph.setSelectedByName('Subtract')
                                },
                                {
                                    label: 'Divide',
                                    onClick: () => this.props.data.graph.setSelectedByName('Divide')
                                },
                                {
                                    label: 'Multiply',
                                    onClick: () => this.props.data.graph.setSelectedByName('Multiply')
                                },
                                {
                                    label: 'Modulus',
                                    onClick: () => this.props.data.graph.setSelectedByName('Modulus')
                                },
                            ]
                        },
                        {
                            label: 'Trig',
                            dropDown: [{
                                    label: 'Sine',
                                    onClick: () => this.props.data.graph.setSelectedByName('Sin')
                                },
                                {
                                    label: 'Cosine',
                                    onClick: () => this.props.data.graph.setSelectedByName('Cos')
                                },
                                {
                                    label: 'Tangent',
                                    onClick: () => this.props.data.graph.setSelectedByName('Tan')
                                },
                            ]
                        },
                    ]}
                />   

                <div className={styles.content}>                                      
                    {
                        this.props.data && (<ParameterGraph data = {
                            this.props.data
                        }/>)
                    }

                    {
                        !this.props.data && (
                            <p className={styles.no_node_selected}>
                                <em> no node selected</em>
                            </p>
                        )
                    }
                </div>                

            </PanelComponent>
	    )
	}
};