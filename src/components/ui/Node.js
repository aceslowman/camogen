import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';

const style = {
	inner: {
		maxHeight: '0px',
	},
};

const Node = observer(class Node extends React.Component {

	static contextType = MainContext;

	constructor() {
		super();

		this.innerRef = React.createRef();

		this.state = {
			expanded: false,
		};
	}

	handleExpand = () => {
		this.setState(prevState => ({
			...prevState,
			expanded: !prevState.expanded
		}));
	}

	render() {
		
		if (this.innerRef.current) {
			style.inner = {
				...style.inner,
				maxHeight: this.state.expanded ? this.innerRef.current.scrollHeight + 'px' : '0px', 
			}
		}				

		return(
			<div className={this.props.mini ? "miniNode" : "node"}>
				<div className='nodeButtons'>
					<button onClick={this.props.onRemove}>x</button>
	          		<button onClick={this.handleExpand}>{this.state.expanded ? 'v' : '>'}</button>
	          		<button onClick={()=>{}}>≡</button>
					<button onClick={this.props.onSave}>s</button>
					<button onClick={this.props.onLoad}>l</button>
	          	</div>

	          	<div className='nodeContainerMain' onClick={this.handleClick}>				
		            <legend onClick={this.handleExpand}>
						{this.props.title}
					</legend>				           

		            <div className='nodeContainerInner' style={style.inner} ref={this.innerRef}>
						<div className='nodeContainerInnerFix' >
							{this.props.children}	
						</div>		            	
		            </div>
	            </div>                
	        </div>
	    )
	}
});

export default Node;