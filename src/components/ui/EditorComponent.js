import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import Panel from '../ui/PanelComponent';
import styles from './EditorComponent.module.css';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";

const EditorComponent = observer(class EditorComponent extends React.Component {
    static contextType = MainContext;  

    constructor() {
        super();

        this.state = {
            edit_buffer: '',
            edit_type: 'vert',
        };
    }

    handleRefresh = () => {
        this.props.data.init()
    }

    handleEditorChange = e => {
        this.setState({
            edit_buffer: e
        });
        this.props.data[this.state.edit_type] = e;
    }

    handleFragEdit = () => {
        this.setState(prevState => ({
            ...prevState,
            edit_buffer: this.props.data.frag,
            edit_type: 'frag',
        }));
    }

	handleVertexEdit = () => {
	    this.setState(prevState => ({
	        ...prevState,
	        edit_buffer: this.props.data.vert,
	        edit_type: 'vert',
	    }));
	}

	render() {	
		this.store = this.context.store;

		return(
			<Panel 
				title="Editor"			
				className={styles.editor}	
			>		                
                <div className={styles.toolbar}>
                    <div>
                        <button className={styles.toolbar_label}>
                            <strong>FILE</strong>
                        </button>
                        <button 
                            title="save shader" 
                            onClick={()=>this.props.data.save()}
                        ><em>save</em></button>
                        <button 
                            title="load shader" 
                            onClick={()=>this.props.data.load()}
                        ><em>load</em></button>
                    </div>
                    
                    <div>
                        <button className="nodeToolsLabel">
                            <strong>EDIT</strong>
                        </button>
                        <button 
                            title="edit vertex shader" 
                            onClick={this.handleVertexEdit}
                            className={
                                (this.state.edit_type === 'vert') 
                                    ? "white_button" 
                                    : ""
                            } 
                        ><em>vertex</em></button>
                        <button 
                            title="edit fragment shader" 
                            onClick={this.handleFragEdit}
                            className={
                                (this.state.edit_type === 'frag') 
                                    ? "white_button" 
                                    : ""
                            } 
                        ><em>fragment</em></button>								
                        <button 
                            title="edit parameters" 
                            onClick={this.handleParamEdit}
                            className={
                                (this.state.edit_type === 'param') 
                                    ? "white_button"
                                    : ""
                            }
                        ><em>parameters</em></button>	
                        <button 
                            title="refresh shader" 
                            onClick={this.handleRefresh}
                        ><em>refresh</em></button>
                    </div>															
                </div>


				{/* {(	this.state.expandEdit 
                    && this.state.expandMain 
                    && this.state.edit_type !== 'param'
                ) && ( */}
                    <AceEditor
                        mode="glsl"
                        theme="monokai"
                        onChange={this.handleEditorChange}
                        value={this.state.edit_buffer}
                        height=""
                        width="500px"
                        minHeight="500px"
                        className={styles.ace_editor}		 												
                    />
                {/* )} */}
			</Panel>
	    )
	}
});

export default EditorComponent;