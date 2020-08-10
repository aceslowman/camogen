import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import ToolbarComponent from "./ui/ToolbarComponent";
import Panel from './ui/PanelComponent';
import styles from './ShaderEditorComponent.module.css';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";

export default @observer class ShaderEditorComponent extends React.Component {
    static contextType = MainContext;  

    constructor() {
        super();

        this.state = {
            edit_buffer: '',
            edit_type: 'vert',
        };
    }

    handleRefresh = () => {
        console.log('|refreshing')
        // restore the draw loop, if stopped
        this.store.p5_instance.loop();
        // re-initialize the data
        this.props.data.init()
    }

    handleEditorChange = e => {
        this.setState({
            edit_buffer: e
        });
        this.props.data[this.state.edit_type] = e;
    }

    handleFragEdit = () => {
        if(this.props.data) {
            this.setState(prevState => ({
                ...prevState,
                edit_buffer: this.props.data.frag,
                edit_type: 'frag',
            }));
        }
    }

	handleVertexEdit = () => {
        if(this.props.data) {
            this.setState(prevState => ({
                ...prevState,
                edit_buffer: this.props.data.vert,
                edit_type: 'vert',
            }));
        }
    }
    
    handleParamEdit = () => {
        this.setState(prevState => ({
            ...prevState,
            edit_type: 'param',
        }));
    }

	render() {	
        this.store = this.context.store;

		return(
            <Panel 
                collapsed={this.props.collapsed}
                onRemove={()=>this.store.removePanel('Shader Editor')}
				title="Shader Editor"			
                className={styles.editor}
                style={{minWidth:400,flexGrow:2,flexShrink:0}}
			>		
                <ToolbarComponent  
                    items={[
                        {
                            label: 'Save Shader',
                            onClick: () => this.props.data.save()
                        },
                        {
                            label: 'Edit Fragment',
                            onClick: () => this.handleFragEdit()
                        }, 
                        {
                            label: 'Edit Vertex',
                            onClick: () => this.handleVertexEdit()
                        },
                        {
                            label: 'Refresh',
                            onClick: () => this.handleRefresh()
                        },
                    ]}
                />   

                <div className={styles.content}>

                    {
                        this.props.data && (<AceEditor
                            mode="glsl"
                            theme="monokai"
                            onChange={this.handleEditorChange}
                            value={this.props.data[this.state.edit_type]}
                            height=""
                            width=""
                            minHeight="500px"
                            className={styles.ace_editor}		 												
                        />)
                    }

                    {
                        !this.props.data && (
                            <p className={styles.no_node_selected}>
                                <em> no shader node selected</em>
                            </p>
                        )
                    }
                                         
                </div>                

                { this.props.data && this.props.data.node.graph.updateFlag ? '' : '' }
			</Panel>
	    )
	}
};