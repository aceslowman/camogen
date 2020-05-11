import React from 'react';
import { observer } from 'mobx-react';
import ParameterGraph from '../ParameterGraphComponent';
import MainContext from '../../MainContext';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const style = {
	zIndex: 10,
	inner: {
		maxHeight: '42px',
	},
	edit: {
		maxWidth: '0px'
	},
};

const Node = observer(class Node extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.innerRef = React.createRef();		

		this.state = {
			expanded: false,
			editing: '',			
			focus: false,
			activeParameter: ''
		};
	}

	handleExpand = () => {
		if(!this.props.mini) {
			this.setState(prevState => ({
				...prevState,
				expanded: !prevState.expanded
			}));
		}
	}

	handleVertexEdit = () => {
		if (!this.props.mini) {
			this.setState(prevState => ({
				...prevState,				
				editing: this.props.data.vert,
				edit_type: 'vert',
			}));
		}
	}

	handleFragEdit = () => {
		if (!this.props.mini) {
			this.setState(prevState => ({
				...prevState,
				editing: this.props.data.frag,
				edit_type: 'frag',
			}));
		}
	}

	handleParamEdit = () => {
		if (!this.props.mini) {
			this.setState(prevState => ({
				...prevState,
				// editing: this.props.data.frag,
				edit_type: 'param',
			}));
		}
	}

	handleRefresh = () => {		
		this.props.data.init()			
	}

	handleEditorChange = (e) => {		
		this.setState({editing: e})
		this.props.data[this.state.edit_type] = e;		
	}
	

	render() {
		this.store = this.context.store;
		
		if (this.innerRef.current && !this.props.mini) {
			style.inner = {
				...style.inner,
				maxHeight: this.state.expanded ? '800px' : '42px',
			}
			style.edit = {
				...style.edit,
				maxWidth: this.state.expanded ? '500px' : '0px',
			}
		}				

		return(
			<div 
				className={this.props.mini ? "miniNode" : "node"}
				onClick={this.handleClick}
				style={{...style.inner, zIndex: this.props.focus ? 100 : 10}}
			>
				<div className='nodeTools'>
					<div style={{}}>
						<button onClick={this.props.onRemove}>x</button>
						{!this.props.mini && (
						<button onClick={this.handleExpand}>
							{this.state.expanded ? 'v' : '>'}
						</button>
						)}
					</div>													
	          	</div>

	          	<div className='nodeContainer' onClick={this.handleClick}>				
		            <legend onClick={this.handleExpand}>
						{this.props.title}
					</legend>				           

		            <div className='nodeInner' ref={this.innerRef}>
						<div>
							{this.props.children}	
						</div>		            	
		            </div>
	            </div>   


						<div className='nodeEdit' style={style.edit}>
							
								<div className="horizontal_toolbar">
									<div>
										<button className="nodeToolsLabel"><strong>FILE</strong></button>
										<button 
											title="save shader" 
											onClick={this.props.onSave}
										><em>save</em></button>
										<button 
											title="load shader" 
											onClick={this.props.onLoad}
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
							

							{(this.state.expanded && !this.props.mini && this.state.edit_type !== 'param' && this.state.editing) && (
								<AceEditor
									mode="javascript"
									theme="monokai"
									onChange={this.handleEditorChange}
									value={this.state.editing}
									width="500px"
									minHeight="500px"
									className="editor"	
									fontSize="12px"	 												
								/>
							)}
							{(this.state.expanded && !this.props.mini && this.state.edit_type === 'param') && ( 
								<ParameterGraph 
									data={this.state.activeParameter}
								/>						
							)}
							

						</div> 
					

				
				            
	        </div>
	    )
	}
});

export default Node;