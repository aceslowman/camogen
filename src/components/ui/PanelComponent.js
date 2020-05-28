import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import styles from './PanelComponent.module.css';

const PanelComponent = observer(class PanelComponent extends React.Component {

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
		return(
			<div className={styles.panel} style={this.props.style}>
				<div className={styles.panel_buttons}>
					<button onClick={this.props.onRemove}>
						x
					</button>                                                
					<legend onClick={this.props.onActive}> 
						{this.props.title}
					</legend>
				</div>                    

				<div className={styles.panel_content + ' ' + this.props.className} ref={this.props.onRef}>
					{this.props.children}	
				</div>              
			</div>
	    )
	}
});

export default PanelComponent;