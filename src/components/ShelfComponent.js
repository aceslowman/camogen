import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import styles from './ShelfComponent.module.css';

export default @observer class ShelfComponent extends React.Component {
    static contextType = MainContext;   	

	render() {	
		this.store = this.context.store;

		return(
			<div className={styles.shelf} style={this.props.style}>								
				{this.props.children}
			</div>			
	    )
	}
};