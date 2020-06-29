import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import styles from './TextComponent.module.css';

export default @observer class TextComponent extends React.PureComponent {
	static contextType = MainContext;

	render() {		
		this.store = this.context.store;

		return(
			<div className={styles.text}>
                {this.props.children}
            </div>	
	    )
	}
};