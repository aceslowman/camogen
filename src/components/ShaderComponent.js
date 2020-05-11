import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Uniform from './UniformComponent';
import ParameterGraph from './ParameterGraphComponent';

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

const ShaderComponent = observer(class ShaderComponent extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.innerRef = React.createRef();

		this.state = {
			expandMain: false,
			expandEdit: false,
			editing: '',
			edit_type: 'param',
			focus: false,
			activeParameter: ''
		};
	}
	
	handleRemove = () => {
		this.props.data.target.removeShader(this.props.data);
	}

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			expandMain: !prevState.expandMain,
			expandEdit: !prevState.expandMain ? false : prevState.expandEdit
		}));
	}

	handleExpandEdit = () => {
		this.setState(prevState => ({
			...prevState,
			expandEdit: !prevState.expandEdit
		}));
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
				edit_type: 'param',
			}));
		}
	}

	handleRefresh = () => {
		this.props.data.init()
	}

	handleEditorChange = (e) => {
		this.setState({
			editing: e
		})
		this.props.data[this.state.edit_type] = e;
	}

	render() {
		this.store = this.context.store;
		
		if (this.innerRef.current) {
			style.inner = {
				...style.inner,
				maxHeight: this.state.expandMain ? '800px' : '42px',
			}
			style.edit = {
				...style.edit,
				maxWidth: (this.state.expandMain && this.state.expandEdit) || (this.state.activeParameter && this.state.expandEdit && this.state.expandMain) ? '500px' : '0px',
			}
		}				

		return(
			<div 
				className={this.props.mini ? "miniNode" : "node"}
				onClick={this.handleClick}
				style={{...style.inner, zIndex: this.state.focus ? 100 : 10}}
			>
				<div className='nodeTools'>
					<div style={{}}>
						<button onClick={this.handleRemove}>x</button>
						<button onClick={this.handleExpand}>
							{this.state.expandMain ? 'v' : '>'}
						</button>
						<button onClick={this.handleExpandEdit}>
							≡
						</button>
					</div>													
	          	</div>

	          	<div className='nodeContainer' onClick={this.handleClick}>				
		            <legend onClick={this.handleExpand}>
						{this.props.data.name}
					</legend>				           

		            <div className='nodeInner' ref={this.innerRef}>
						<div>
							{this.props.data.uniforms.map((uniform)=>{                        
								return (
									<Uniform 
										key={uniform.uuid}
										data={uniform}	
										onFocus={e=>this.setState({activeParameter: e})}
									/>
								);                     
							})}
						</div>		            	
		            </div>
	            </div>   

				<div className='nodeEdit' style={style.edit}>
				
					<div className="horizontal_toolbar">
						<div>
							<button className="nodeToolsLabel"><strong>FILE</strong></button>
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
				

					{(this.state.expandEdit && this.state.expandMain && this.state.edit_type !== 'param' && this.state.editing) && (
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
					{(this.state.expandEdit && this.state.expandMain && this.state.edit_type === 'param') && ( 
						<ParameterGraph 
							data={this.state.activeParameter}
						/>						
					)}
				</div>
				 		            
	        </div>
	    )
	}
});

export default ShaderComponent;