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
		if(!this.props.mini) {
			this.setState(prevState => ({
				...prevState,
				expanded: !prevState.expanded
			}));
		}
	}

	render() {
		
		if (this.innerRef.current && !this.props.mini) {
			style.inner = {
				...style.inner,
				maxHeight: this.state.expanded ? this.innerRef.current.scrollHeight + 'px' : '0px', 
			}
		}				

		return(
			<div className={this.props.mini ? "miniNode" : "node"}>
				<div className='nodeTools'>
					<button onClick={this.props.onRemove}>x</button>
					{!this.props.mini && (
						<React.Fragment>
							<button onClick={this.handleExpand}>{this.state.expanded ? 'v' : '>'}</button>
							<button onClick={()=>{}}>≡</button>
							{this.state.expanded && (
								<React.Fragment>
									<button onClick={this.props.onSave}>s</button>
									<button onClick={this.props.onLoad}>l</button>
								</React.Fragment>						
							)}	
						</React.Fragment>
					)}
				
	          	</div>

	          	<div className='nodeContainer' onClick={this.handleClick}>				
		            <legend onClick={this.handleExpand}>
						{this.props.title}
					</legend>				           

		            <div className='nodeInner' style={style.inner} ref={this.innerRef}>
						<div>
							{this.props.children}	
						</div>		            	
		            </div>
	            </div>                
	        </div>
	    )
	}
});

export default Node;