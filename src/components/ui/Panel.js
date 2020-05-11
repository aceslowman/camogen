import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';

const style = {
    legend: {
        color: 'white',
        backgroundColor: 'black',
        border: '1px solid white',
    },
};

const Panel = observer(class Panel extends React.Component {

	static contextType = MainContext;

	constructor(props) {
		super(props); 		

		this.state = {
			active: props.active,
		};
	}

	componentDidMount() {
		document.addEventListener('click', this.props.onClickAway);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.props.onClickAway);
	}

	render() {	
        style.legend = {
            ...style.legend,
            color: this.props.active ? 'black' : 'white',
            backgroundColor: this.props.active ? 'white' : 'black',
            border: this.props.active ? '1px solid black' : '1px solid white',
        }

		return(
			<fieldset className="panel" ref={this.props.onRef} style={this.props.style}>
				<div className='panelButtons' style={style.buttons}>
					<button onClick={this.props.onRemove}>x</button>                                                
					{ this.props.title && (
						<legend 
							style={style.legend} 
							onClick={this.props.onActive}
						> {this.props.title}
						</legend>
					)}
				</div>                    

				<div className='panelContent'>
					{this.props.children}	
				</div>              
			</fieldset>
	    )
	}
});

export default Panel;