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
			edit_buffer: '',
			edit_type: 'param',
			updateFlag: false
		};
	}

	componentDidMount() {
		this.props.data.component = this;
	}
	
	handleRemove = () => {		
		this.props.data.node.graph.removeNode(this.props.data.node.uuid);
	}

	handleEdit = () => {
		console.log(this.props.data.node.isBeingEdited)
		this.props.data.node.edit();
	}

	handleExpandMain = () => {
		this.setState(prevState => ({
			...prevState,
			expandMain: !prevState.expandMain,
		}));
	}

	componentDidMount() {
		this.setState(prevState => ({
			updateFlag: !prevState.updateFlag
		}))
	}
	
	render() {
		this.store = this.context.store;

		if (this.innerRef.current) {
			let bounds = this.innerRef.current.getBoundingClientRect();

			style.inner = {
				...style.inner,
				maxHeight: this.state.expandMain || this.props.data.node.selected ? `${bounds.height}px` : '0px',
			}					
		}	
		
		return(
			<div 
				ref="node"
				className={styles.node}
				onClick={this.handleClick}
				style={{...style.main}}
			>
				<div className={styles.node_bar}>
					<div className={styles.node_buttons}>
						<button className="large_symbol" onClick={this.handleRemove}>×</button>
						<button className="large_symbol" onClick={this.handleExpandMain}>
							{
								this.state.expandMain ? '↥' : '↧'
							}
						</button>
						<button className={`large_symbol ${this.props.data.node.isBeingEdited ? 'white_button' : ''}`}
							onClick={()=>this.handleEdit(null)}
						> {/*≡*/}✎ </button>																		 
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
							{
								React.Children.map(this.props.data.controls, child => {
									// Checking isValidElement is the safe way and avoids a TS error too.
									if (React.isValidElement(child)) {
										return React.cloneElement(child, {
											enabled: this.state.expandMain || this.props.data.node.selected
										})
									}

									return child;
								})
							}
						</div>																	
					</div>
				</div>   
			</div>
	    )
	}
});

export default ShaderComponent;