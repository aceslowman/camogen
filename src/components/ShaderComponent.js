import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Uniform from './UniformComponent';

import styles from './ShaderComponent.module.css';

const style = {
	inner: {
		maxHeight: '0px',
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
			edit_buffer: '',
			edit_type: 'param',
			focus: false,
			activeParameter: '',
			updateFlag: false
		};
	}

	componentDidMount() {
		this.props.data.component = this;
	}
	
	handleRemove = () => {
		console.log(this.props.data)		
		this.props.data.node.graph.removeNode(this.props.data.node.uuid);
	}

	handleExpandMain = () => {
		this.setState(prevState => ({
			...prevState,
			expandMain: !prevState.expandMain,
		}));
	}

	handleExpandEdit = (e) => {
		this.setState(prevState => ({
			...prevState,
			activeParameter: e ? e : '',
			expandEdit: e ? true : !prevState.expandEdit,
			expandMain: e ? false : true
		}));
	}

	handleSelectParameter = (e) => {
		this.setState(prevState => ({
			...prevState,
			activeParameter: e,
			expandEdit: true,
			// expandMain: e ? false : true
		}));
	}



	

	

	// handleDragStart = e => {}

	// handleDrag = (e,d) => {
	// 	this.props.data.position = {
	// 		x: d.node.offsetLeft+d.x,
	// 		y: d.node.offsetTop+d.y
	// 	}		
	// }

	// handleDragStop = (e,d) => {
	// 	// snapback
	// 	if (!this.state.dragDestination) {
	// 		d.node.style.transform = 'translate(0px,0px)';
	// 	}
	// }

	componentDidMount() {
		this.setState(prevState => ({
			updateFlag: !prevState.updateFlag
		}))
	}
	
	render() {
		this.store = this.context.store;
		console.log(this.innerRef)
		if (this.innerRef.current) {
			let bounds = this.innerRef.current.getBoundingClientRect();

			console.log(bounds)

			style.inner = {
				...style.inner,
				maxHeight: this.state.expandMain ? `${bounds.height}px` : '0px',
			}
			
			// style.edit = {
			// 	...style.edit,
			// 	maxWidth: (this.state.expandMain && this.state.expandEdit) 
			// 	|| (this.state.activeParameter && this.state.expandEdit 
			// 		&& this.state.expandMain) 
			// 			? '500px' : '0px',
			// }
		}	
		
		return(
			// <Draggable 
			// 	handle=".nodeLegend"
			// 	position={{x:0,y:0}}
			// 	onStart={this.handleDragStart}
			// 	onDrag={this.handleDrag}
			// 	onStop={this.handleDragStop}
			// >
				<div 
					ref="node"
					className={styles.node}
					onClick={this.handleClick}
					style={{...style.main}}
				>
					<div className={styles.node_bar}>
						<div className={styles.node_buttons}>
							<button onClick={this.handleRemove}>x</button>
							<button onClick={this.handleExpandMain}>
								{this.state.expandMain ? 'v' : '>'}
							</button>
							<button 								
								onClick={()=>this.handleExpandEdit(null)}
							>≡</button>																		 
						</div>
						<div className={styles.node_legend}>
							<legend>
								{this.props.data.name}																				
							</legend>
						</div>
					</div>					

					<div className={styles.node_container} onClick={this.handleClick}> 
						<div 
							className={styles.node_container_inner}
							
							style={{
								...style.inner, 
								// overflowY: this.state.expandMain ? 'auto' : 'none'
							}}
						>		
							<div ref={this.innerRef} >
								{this.props.data.uniforms.map((uniform)=>{                        
									return (
										<Uniform 
											enabled={this.state.expandMain}
											key={uniform.uuid}
											data={uniform}
											activeParam={
												this.state.activeParameter
											}	
											onDblClick={
												this.handleSelectParameter
											}
										/>
									);                     
								})}	
							</div>																	
						</div>
					</div>   
{/* 
					<div className='nodeEdit' style={style.edit}>					
						<div className="horizontal_toolbar">
							<div>
								<button className="nodeToolsLabel">
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
						</div> */}
{/* 
						{(	this.state.expandEdit 
							&& this.state.expandMain 
							&& this.state.edit_type !== 'param'
						) && (
							<AceEditor
								mode="glsl"
								theme="monokai"
								onChange={this.handleEditorChange}
								value={this.state.edit_buffer}
								height=""
								width="500px"
								minHeight="500px"
								className="editor"		 												
							/>
						)}

						{(	this.state.expandEdit 
							&& this.state.expandMain 
							&& this.state.edit_type === 'param'
							) && ( 
							<ParameterGraph 
								data={this.state.activeParameter}
							/>						
						)}						 */}
					{/* </div>									 */}
				</div>
			// </Draggable>			
	    )
	}
});

export default ShaderComponent;